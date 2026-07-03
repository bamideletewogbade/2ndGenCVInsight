"""Application configuration loaded from environment variables."""

import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env from the backend directory (where this file lives)
# override=True ensures our .env takes precedence over system env vars
_env_path = Path(__file__).parent / ".env"
load_dotenv(_env_path, override=True)

# NVIDIA NIM API
NVIDIA_API_KEY: str = os.getenv("NVIDIA_API_KEY", "")
BASE_URL: str = "https://integrate.api.nvidia.com/v1"

# Database
DATABASE_URL: str = os.getenv(
    "DATABASE_URL",
    "postgresql+asyncpg://neondb_owner:npg_Hz9fU8TMADcd@ep-old-snow-atitv2tn-pooler.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require",
)

# Prompt configuration
PROMPT_VERSION: str = "v1.0"
PROMPT_TEMPLATE_NAME: str = "resume-analysis-full"

# File handling
MAX_FILE_SIZE_MB: int = 10
MIN_EXTRACTED_TEXT_LENGTH: int = 50

# Model fallback chain
MODEL_CONFIGS: list[dict] = [
    {"id": "z-ai/glm-5.2", "timeout_ms": 20000, "label": "GLM 5.2 (Z-AI)"},
    {"id": "minimaxai/minimax-m3", "timeout_ms": 25000, "label": "MiniMax M3"},
    {
        "id": "nvidia/nemotron-3-ultra-550b-a55b",
        "timeout_ms": 25000,
        "label": "Nemotron 3 Ultra 550B (NVIDIA)",
    },
]

# Pricing per 1M tokens
MODEL_PRICING: dict[str, dict[str, float]] = {
    "z-ai/glm-5.2": {"input": 0.35, "output": 0.40},
    "minimaxai/minimax-m3": {"input": 0.30, "output": 0.30},
    "nvidia/nemotron-3-ultra-550b-a55b": {"input": 0.50, "output": 0.50},
}