"""SQLAlchemy async database setup, models, and session management."""

import re
import uuid
from datetime import datetime, timezone

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text, Float, Boolean, JSON
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column

from config import DATABASE_URL

# Build a clean asyncpg-compatible URL.
# asyncpg doesn't understand "sslmode" or "channel_binding" (psycopg2 params).
# We strip them and pass ssl via connect_args instead.
_clean_url = DATABASE_URL
for param in ("sslmode", "channel_binding"):
    _clean_url = re.sub(rf"[?&]{re.escape(param)}=[^&]*", lambda m: "?" if m.group().startswith("?") else "&", _clean_url)
    _clean_url = _clean_url.rstrip("?&")

engine = create_async_engine(
    _clean_url,
    echo=False,
    pool_pre_ping=True,
    connect_args={"ssl": True},  # Neon and most cloud Postgres require SSL
)
async_session = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)


class Base(DeclarativeBase):
    pass


class Analysis(Base):
    __tablename__ = "analyses"

    id: Mapped[str] = mapped_column(
        String, primary_key=True, default=lambda: str(uuid.uuid4())
    )
    filename: Mapped[str] = mapped_column(String(500), nullable=False)
    file_type: Mapped[str] = mapped_column(String(50), nullable=False)
    resume_text: Mapped[str] = mapped_column(Text, nullable=False)
    job_description: Mapped[str | None] = mapped_column(Text, nullable=True)
    analysis_json: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )


class AnalysisMetric(Base):
    __tablename__ = "analysis_metrics"

    id: Mapped[str] = mapped_column(
        String, primary_key=True, default=lambda: str(uuid.uuid4())
    )
    analysis_id: Mapped[str] = mapped_column(
        String, ForeignKey("analyses.id", ondelete="CASCADE"), nullable=False
    )
    request_id: Mapped[str] = mapped_column(String, nullable=False)
    timestamp: Mapped[str] = mapped_column(String, nullable=False)
    model_used: Mapped[str] = mapped_column(String(200), nullable=False)
    fallback_triggered: Mapped[bool] = mapped_column(Boolean, default=False)
    fallback_reason: Mapped[str | None] = mapped_column(String(500), nullable=True)
    prompt_tokens: Mapped[int] = mapped_column(Integer, default=0)
    completion_tokens: Mapped[int] = mapped_column(Integer, default=0)
    total_tokens: Mapped[int] = mapped_column(Integer, default=0)
    estimated_cost_usd: Mapped[float] = mapped_column(Float, default=0.0)
    latency_ms: Mapped[int] = mapped_column(Integer, default=0)
    time_to_first_token_ms: Mapped[int] = mapped_column(Integer, default=0)
    response_status: Mapped[str] = mapped_column(String(50), default="success")
    retry_count: Mapped[int] = mapped_column(Integer, default=0)
    prompt_version: Mapped[str] = mapped_column(String(50), nullable=False)
    prompt_template_name: Mapped[str] = mapped_column(String(200), nullable=False)
    json_validation_status: Mapped[str] = mapped_column(String(50), default="valid")


async def init_db() -> None:
    """Create all tables if they don't exist. Fails silently if DB is unreachable."""
    try:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        print("[DB] Tables ready.")
    except Exception as exc:
        print(f"[DB] Warning: could not connect to database — {exc}")
        print("[DB] The app will work, but analyses won't be persisted.")


async def get_session() -> AsyncSession:
    """FastAPI dependency that yields an async database session."""
    async with async_session() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise