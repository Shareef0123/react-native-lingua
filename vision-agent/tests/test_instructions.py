"""Unit tests for building teacher instructions from call custom data.

These are pure (no LLM / no network), so they always run — they lock the contract
between the Expo backend's `buildLessonCallCustom` (lib/server/lessonCallData.ts)
and what the agent actually consumes on join.

Run:
    uv run pytest tests/test_instructions.py
"""

import env_bootstrap  # loads .env + bridges Stream keys  # noqa: F401

from agent import build_instructions_from_context, greeting_from_context

CUSTOM = {
    "kind": "ai-teacher-audio",
    "lessonId": "es-lesson-1",
    "lessonTitle": "Basic Greetings",
    "lessonDescription": "Learn how to say hello and goodbye.",
    "languageName": "Spanish",
    "languageNativeName": "Español",
    "goals": ["Say hello and goodbye", "Learn courtesy words"],
    "vocabulary": [
        {"word": "Hola", "translation": "Hello", "phonetic": "OH-lah"},
        {"word": "Gracias", "translation": "Thank you"},
    ],
    "phrases": [
        {"phrase": "¿Cómo estás?", "translation": "How are you?"},
    ],
    "aiTeacherRole": "language tutor",
    "aiTeacherPersona": "warm and encouraging",
    "aiTeacherTopic": "greetings",
    "aiTeacherGoal": "help the student greet confidently",
    "aiTeacherSystemPrompt": "Always start with a friendly hello.",
    "aiTeacherGreeting": "¡Hola! Ready to practice?",
}


def test_instructions_include_lesson_context():
    text = build_instructions_from_context(CUSTOM)
    # Language, lesson, goals, vocab, phrases, persona, and system prompt all land.
    assert "Spanish" in text and "Español" in text
    assert "Basic Greetings" in text
    assert "Say hello and goodbye" in text
    assert "Hola = Hello" in text
    assert "OH-lah" in text
    assert "¿Cómo estás? = How are you?" in text
    assert "warm and encouraging" in text
    assert "greetings" in text
    assert "Always start with a friendly hello." in text


def test_instructions_fall_back_without_optional_fields():
    # Only the language is present — should still produce sane baseline instructions.
    text = build_instructions_from_context({"languageName": "French"})
    assert "French" in text
    assert "ALWAYS speak in English" in text


def test_greeting_prefers_lesson_greeting():
    assert "¡Hola! Ready to practice?" in greeting_from_context(CUSTOM)


def test_greeting_defaults_when_absent():
    greeting = greeting_from_context({"languageName": "Spanish"})
    assert "Greet the student warmly" in greeting
