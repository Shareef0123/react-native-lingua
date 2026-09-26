# vision-agent — AI language teacher (voice)

A [Vision Agents](https://visionagents.ai) Python service that acts as the app's
**AI language teacher**. It is **voice only** and uses:

- **Gemini Realtime** (Google) as the LLM (the teacher's brain + voice, one low-latency model)
- **Stream Edge** (getstream) for real-time audio transport — the same Stream
  project the Expo app uses

The teacher **always speaks English** and teaches the selected target language
*through* English (explaining, translating, and correcting in English).

## How the lesson reaches the agent

The mobile app never passes lesson data to this service directly. Instead:

1. The Expo API route (`src/app/api/stream-call+api.ts`) packs the whole lesson —
   target language, goals, vocabulary, phrases, and the AI teacher prompt — into
   the Stream call's **custom data**.
2. The app calls `POST /api/agent-session`, which grants this agent admin rights
   on the call, takes the call live, and asks the Vision Agent server to join it
   (`POST /calls/{call_id}/sessions`).
3. On join, `join_call` in `agent.py` reads `call.custom` and tailors the
   teacher's instructions and greeting to that exact lesson. The `TARGET_LANGUAGE`
   env var is only a fallback for console `run` mode.

The app tears the session down (`DELETE /calls/{call_id}/sessions/{session_id}`)
when the learner ends the call or leaves the screen.

## How credentials work

- **Stream** keys are reused from the Expo app's root `.env` (`../.env`). The app
  stores them as `EXPO_STREAM_API_KEY` / `EXPO_STREAM_API_SECRET`; `env_bootstrap.py`
  bridges them to the `STREAM_API_KEY` / `STREAM_API_SECRET` names the plugin expects.
- **Google (Gemini)** key is specific to this service and lives in `vision-agent/.env`
  (`GOOGLE_API_KEY`). It is server-side only — never bundle it into the mobile app.

## Setup

1. Copy `.env.example` to `.env` and set `GOOGLE_API_KEY`.
2. Make sure the app root `.env` has `EXPO_STREAM_API_KEY` / `EXPO_STREAM_API_SECRET`.
3. Install dependencies:

   ```bash
   uv sync
   ```

4. Run the agent:

   ```bash
   uv run agent.py run     # single-call console (opens a browser demo link)
   uv run agent.py serve   # HTTP server that spawns an agent per call
   ```

Optional: set `TARGET_LANGUAGE` (defaults to `Spanish`) to change what is taught.

## Run the tests

```bash
uv run pytest
```

## Docker

```bash
docker build -t vision-agent .
docker run --env-file .env -p 8000:8000 vision-agent
```
