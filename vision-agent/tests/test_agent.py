"""Tests for the AI language teacher using `vision_agents.testing`.

These are text-only integration tests: they exercise the teacher's instructions
against a chat LLM (no audio/RTC needed). The live agent uses Gemini
Realtime for voice — see agent.py.

Run:
    uv run pytest
"""

import os

import env_bootstrap  # loads .env + bridges Stream keys  # noqa: F401
import pytest

from agent import build_instructions

from vision_agents.plugins import gemini
from vision_agents.testing import LLMJudge, TestSession

pytestmark = [
    pytest.mark.integration,
    pytest.mark.skipif(
        not os.getenv("GOOGLE_API_KEY"),
        reason="GOOGLE_API_KEY not set",
    ),
]

INSTRUCTIONS = build_instructions("Spanish")

# gemini.LLM() defaults to gemini-3.1-pro-preview, which has no free-tier quota
# (returns HTTP 429 / limit: 0). Use a flash model that is free-tier eligible.
TEST_MODEL = "gemini-flash-latest"


async def test_greeting_is_friendly():
    """The teacher should open with a friendly, short greeting."""
    judge = LLMJudge(gemini.LLM(model=TEST_MODEL))

    async with TestSession(llm=gemini.LLM(model=TEST_MODEL), instructions=INSTRUCTIONS) as session:
        response = await session.simple_response("Hi there!")

        assert response.output is not None
        assert len(response.chat_messages) >= 1

        verdict = await judge.evaluate(
            response.chat_messages[-1],
            intent="A friendly, short greeting from a language teacher",
        )
        assert verdict.success, verdict.reason


async def test_teaches_in_english():
    """The teacher explains in English even when asked in the target language."""
    judge = LLMJudge(gemini.LLM(model=TEST_MODEL))

    async with TestSession(llm=gemini.LLM(model=TEST_MODEL), instructions=INSTRUCTIONS) as session:
        response = await session.simple_response("How do I say 'good morning' in Spanish?")

        verdict = await judge.evaluate(
            response.chat_messages[-1],
            intent=(
                "An explanation written in English that teaches the Spanish phrase "
                "and gives its English meaning"
            ),
        )
        assert verdict.success, verdict.reason
