"""Load environment variables for the AI language teacher.

Credentials live in two places so there is a single source of truth:

- Stream credentials come from the Expo app's root ``.env`` (one folder up).
  The mobile app stores them as ``EXPO_STREAM_API_KEY`` / ``EXPO_STREAM_API_SECRET``,
  but the Vision Agents Stream plugin reads the plain ``STREAM_API_KEY`` /
  ``STREAM_API_SECRET`` names, so we alias them here.
- ``GOOGLE_API_KEY`` is specific to this service and lives in ``vision-agent/.env``.

Import this module (``import env_bootstrap``) once, before creating the agent.
"""

import os
from pathlib import Path

from dotenv import load_dotenv

_THIS_DIR = Path(__file__).resolve().parent
_ROOT_ENV = _THIS_DIR.parent / ".env"  # the Expo app's root .env
_LOCAL_ENV = _THIS_DIR / ".env"  # this service's own .env (OPENAI_API_KEY)

# Load the parent app's .env first, then our local one. Local values win.
load_dotenv(_ROOT_ENV)
load_dotenv(_LOCAL_ENV, override=True)

# Bridge the Expo-prefixed Stream names to the names the plugin expects,
# without clobbering values that are already set explicitly.
_ALIASES = {
    "STREAM_API_KEY": "EXPO_STREAM_API_KEY",
    "STREAM_API_SECRET": "EXPO_STREAM_API_SECRET",
}
for target, source in _ALIASES.items():
    if not os.environ.get(target) and os.environ.get(source):
        os.environ[target] = os.environ[source].strip()


def require(*names: str) -> None:
    """Fail fast with a clear message if any required env var is missing."""
    missing = [n for n in names if not os.environ.get(n)]
    if missing:
        raise RuntimeError(
            "Missing required environment variables: "
            + ", ".join(missing)
            + ".\nStream keys come from the app root .env (EXPO_STREAM_API_KEY/"
            "EXPO_STREAM_API_SECRET); GOOGLE_API_KEY goes in vision-agent/.env."
        )
