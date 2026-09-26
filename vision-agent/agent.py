"""AI language teacher — voice-only.

- Transport: Stream Edge (getstream.Edge) — the same Stream project the Expo app uses.
- Brain + voice: Gemini Realtime — one low-latency model that listens and speaks.

The teacher ALWAYS speaks English and teaches the selected target language
*through* English (explaining, translating, and correcting in English).

The lesson to teach is chosen by the mobile app and packed into the Stream call's
**custom data** (target language, goals, vocabulary, phrases, and the AI teacher
prompt). On join, the agent reads that custom data and tailors its instructions
and greeting to the exact lesson. When there is no custom data (e.g. the console
`run` mode), it falls back to the TARGET_LANGUAGE env var (defaults to Spanish).
"""

import logging
import os
from typing import Any

import env_bootstrap  # loads .env files + bridges EXPO_STREAM_* -> STREAM_*  # noqa: F401
from vision_agents.core import Agent, Runner, User
from vision_agents.core.agents import AgentLauncher
from vision_agents.core.instructions import Instructions
from vision_agents.plugins import gemini, getstream

# Stream creds are required for transport; Google key for the Gemini realtime model.
env_bootstrap.require("STREAM_API_KEY", "STREAM_API_SECRET", "GOOGLE_API_KEY")

logger = logging.getLogger("ai-teacher")

TARGET_LANGUAGE = os.environ.get("TARGET_LANGUAGE", "Spanish")

# Default greeting used when the lesson does not carry its own.
DEFAULT_GREETING = (
    "Greet the student warmly in English and ask what they would like to "
    "practice today."
)


def build_instructions(target_language: str) -> str:
    """Baseline teacher behavior used as a fallback when no lesson context is set."""
    return (
        f"You are a friendly, patient AI language teacher for a Duolingo-style app. "
        f"You are teaching the student {target_language}. "
        f"ALWAYS speak in English — every explanation, instruction, correction, and "
        f"encouragement is in English. Only say individual {target_language} words or "
        f"phrases when you are teaching them, and immediately give the English meaning. "
        f"Keep replies short and conversational, like a real speaking tutor. "
        f"Speak one or two sentences at a time, then let the student respond. "
        f"Gently correct pronunciation and grammar, and keep the student motivated."
    )


def build_instructions_from_context(custom: dict[str, Any]) -> str:
    """Build rich teacher instructions from the call's custom lesson data.

    Consumes the fields the Expo backend packs in `buildLessonCallCustom`
    (lib/server/lessonCallData.ts): language, lesson title/description, goals,
    vocabulary, phrases, and the flattened AI teacher prompt.
    """
    target_language = custom.get("languageName") or TARGET_LANGUAGE
    native_name = custom.get("languageNativeName")
    lang_label = (
        f"{target_language} ({native_name})" if native_name else target_language
    )

    parts: list[str] = [build_instructions(lang_label)]

    persona = custom.get("aiTeacherPersona")
    role = custom.get("aiTeacherRole")
    if persona or role:
        parts.append(
            "Your persona: "
            + ", ".join(p for p in [role, persona] if p)
            + "."
        )

    title = custom.get("lessonTitle")
    description = custom.get("lessonDescription")
    if title:
        line = f"Today's lesson is \"{title}\"."
        if description:
            line += f" {description}"
        parts.append(line)

    topic = custom.get("aiTeacherTopic")
    if topic:
        parts.append(f"Focus the conversation on: {topic}.")

    goals = custom.get("goals") or []
    if goals:
        parts.append(
            "By the end, the student should be able to: "
            + "; ".join(str(g) for g in goals)
            + "."
        )

    goal = custom.get("aiTeacherGoal")
    if goal:
        parts.append(f"Your teaching goal: {goal}.")

    vocabulary = custom.get("vocabulary") or []
    if vocabulary:
        vocab_lines = []
        for v in vocabulary:
            word = v.get("word")
            translation = v.get("translation")
            phonetic = v.get("phonetic")
            if not word:
                continue
            entry = f"{word} = {translation}"
            if phonetic:
                entry += f" [{phonetic}]"
            vocab_lines.append(entry)
        if vocab_lines:
            parts.append(
                "Practice this vocabulary with the student: "
                + "; ".join(vocab_lines)
                + "."
            )

    phrases = custom.get("phrases") or []
    if phrases:
        phrase_lines = []
        for p in phrases:
            phrase = p.get("phrase")
            translation = p.get("translation")
            if not phrase:
                continue
            phrase_lines.append(f"{phrase} = {translation}")
        if phrase_lines:
            parts.append(
                "Work these phrases into the conversation: "
                + "; ".join(phrase_lines)
                + "."
            )

    system_prompt = custom.get("aiTeacherSystemPrompt")
    if system_prompt:
        parts.append(str(system_prompt))

    return " ".join(parts)


def greeting_from_context(custom: dict[str, Any]) -> str:
    """Prefer the lesson's own greeting; otherwise ask the LLM to greet warmly."""
    greeting = custom.get("aiTeacherGreeting")
    if greeting:
        return (
            f"Start the lesson by saying this greeting to the student, then invite "
            f"them to respond: \"{greeting}\""
        )
    return DEFAULT_GREETING


async def create_agent(**kwargs) -> Agent:
    """Create a fresh agent for a call. Never reuse an Agent across calls."""
    target_language = kwargs.get("target_language", TARGET_LANGUAGE)
    return Agent(
        edge=getstream.Edge(),
        agent_user=User(name="AI Language Teacher", id="ai-teacher"),
        instructions=build_instructions(target_language),
        # Realtime model = brain + voice in one. No avatar/video processor is
        # configured, so nothing publishes video — this stays voice-only.
        llm=gemini.Realtime(),
    )


async def join_call(agent: Agent, call_type: str, call_id: str, **kwargs) -> None:
    call = await agent.create_call(call_type, call_id)

    # Read the lesson the mobile app packed into the call's custom data and tailor
    # the teacher to it. Instructions are consumed when we join(), so set them
    # before entering the join context below.
    custom: dict[str, Any] = {}
    try:
        response = await call.get()
        custom = response.data.call.custom or {}
    except Exception as exc:  # noqa: BLE001 — non-fatal, fall back to defaults
        logger.warning("Could not read call custom data: %s", exc)

    greeting = DEFAULT_GREETING
    if custom.get("kind") == "ai-teacher-audio":
        agent.instructions = Instructions(
            input_text=build_instructions_from_context(custom)
        )
        greeting = greeting_from_context(custom)
        logger.info(
            "AI teacher configured for lesson %r (%s)",
            custom.get("lessonTitle"),
            custom.get("languageName"),
        )

    # audio_room gates publishing behind goLive. The Expo backend already takes
    # the call live, but do it here too so the agent can publish even if it joins
    # first. Idempotent in practice — ignore "already live".
    try:
        await call.go_live()
    except Exception as exc:  # noqa: BLE001
        logger.debug("go_live skipped: %s", exc)

    async with agent.join(call):
        # Warm greeting so the student hears the teacher immediately.
        await agent.simple_response(text=greeting)
        await agent.finish()  # keep the agent in the call until it ends


runner = Runner(AgentLauncher(create_agent=create_agent, join_call=join_call))


if __name__ == "__main__":
    runner.cli()
