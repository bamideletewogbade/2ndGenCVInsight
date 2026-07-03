"""FastAPI application for CV Insight AI — resume analysis backend."""

from __future__ import annotations

import uuid
from contextlib import asynccontextmanager
from typing import AsyncGenerator

from fastapi import FastAPI, File, Form, HTTPException, UploadFile, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select, delete, func
from sqlalchemy.ext.asyncio import AsyncSession

import ai_client
import database as db
from config import MAX_FILE_SIZE_MB, MODEL_CONFIGS, PROMPT_TEMPLATE_NAME, PROMPT_VERSION
from parser import ParseError, clean_text, extract_text_from_docx, extract_text_from_pdf
from prompts import build_analysis_user_prompt, get_system_prompt
from schemas import (
    AIRequestMetrics,
    AnalysisHistoryItem,
    AnalysisResponse,
    AnalyzeResponse,
    ErrorResponse,
)

ALLOWED_EXTENSIONS = {"pdf", "docx"}
MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024


# ── Lifespan (startup) ─────────────────────────────────────────────────────


@asynccontextmanager
async def lifespan(_app: FastAPI) -> AsyncGenerator[None, None]:
    """Create DB tables on startup."""
    await db.init_db()
    yield


# ── App instance ───────────────────────────────────────────────────────────

app = FastAPI(
    title="CV Insight AI — Backend",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Helpers ────────────────────────────────────────────────────────────────


def _file_extension(filename: str) -> str:
    return filename.rsplit(".", 1)[-1].lower() if "." in filename else ""


# ── Endpoints ──────────────────────────────────────────────────────────────


@app.post("/api/analyze", response_model=AnalyzeResponse)
async def analyze_resume(
    file: UploadFile = File(...),
    job_description: str | None = Form(None),
    session: AsyncSession = Depends(db.get_session),
) -> AnalyzeResponse:
    """Upload a PDF/DOCX resume and receive a full AI analysis."""

    # ── Validate file extension ────────────────────────────────────────
    ext = _file_extension(file.filename or "")
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type '.{ext}'. Only .pdf and .docx are accepted.",
        )

    # ── Read and validate file size ────────────────────────────────────
    file_bytes = await file.read()
    if len(file_bytes) > MAX_FILE_SIZE_BYTES:
        raise HTTPException(
            status_code=413,
            detail=f"File exceeds {MAX_FILE_SIZE_MB} MB limit.",
        )
    if len(file_bytes) == 0:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    # ── Extract text ───────────────────────────────────────────────────
    try:
        if ext == "pdf":
            raw_text = extract_text_from_pdf(file_bytes)
        else:
            raw_text = extract_text_from_docx(file_bytes)
    except ParseError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc

    # ── Clean text ─────────────────────────────────────────────────────
    try:
        resume_text = clean_text(raw_text)
    except ParseError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc

    # ── Call AI ────────────────────────────────────────────────────────
    system_prompt = get_system_prompt()
    user_prompt = build_analysis_user_prompt(resume_text, job_description)

    try:
        result = await ai_client.call_llm(system_prompt, user_prompt)
    except ai_client.APIKeyMissingError:
        raise HTTPException(status_code=503, detail="AI service not configured (missing API key).")
    except ai_client.APIKeyInvalidError:
        raise HTTPException(status_code=503, detail="AI API key is invalid.")
    except ai_client.RateLimitError:
        raise HTTPException(status_code=429, detail="AI service rate-limited. Please try again shortly.")
    except ai_client.AllModelsFailedError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"AI analysis failed: {exc}") from exc

    # ── Build metrics ──────────────────────────────────────────────────
    metrics = ai_client.build_metrics(result)

    # ── Persist to DB (graceful — non-blocking if DB is down) ──────────
    try:
        analysis_id = str(uuid.uuid4())

        analysis_record = db.Analysis(
            id=analysis_id,
            filename=file.filename or "unknown",
            file_type=ext,
            resume_text=resume_text,
            job_description=job_description,
            analysis_json=result["parsed"],
        )
        session.add(analysis_record)

        metric_record = db.AnalysisMetric(
            analysis_id=analysis_id,
            request_id=metrics["request_id"],
            timestamp=metrics["timestamp"],
            model_used=metrics["model_used"],
            fallback_triggered=metrics["fallback_triggered"],
            fallback_reason=metrics["fallback_reason"],
            prompt_tokens=metrics["prompt_tokens"],
            completion_tokens=metrics["completion_tokens"],
            total_tokens=metrics["total_tokens"],
            estimated_cost_usd=metrics["estimated_cost_usd"],
            latency_ms=metrics["latency_ms"],
            time_to_first_token_ms=metrics["time_to_first_token_ms"],
            response_status=metrics["response_status"],
            retry_count=metrics["retry_count"],
            prompt_version=metrics["prompt_version"],
            prompt_template_name=metrics["prompt_template_name"],
            json_validation_status=metrics["json_validation_status"],
        )
        session.add(metric_record)
        await session.flush()
    except Exception:
        # DB write failed — not critical, analysis is still returned
        pass

    # ── Build response ─────────────────────────────────────────────────
    analysis_out = AnalysisResponse.model_validate(result["parsed"])
    metrics_out = AIRequestMetrics(
        requestId=metrics["request_id"],
        timestamp=metrics["timestamp"],
        modelUsed=metrics["model_used"],
        fallbackTriggered=metrics["fallback_triggered"],
        fallbackReason=metrics["fallback_reason"],
        promptTokens=metrics["prompt_tokens"],
        completionTokens=metrics["completion_tokens"],
        totalTokens=metrics["total_tokens"],
        estimatedCostUsd=metrics["estimated_cost_usd"],
        latencyMs=metrics["latency_ms"],
        timeToFirstTokenMs=metrics["time_to_first_token_ms"],
        responseStatus=metrics["response_status"],
        retryCount=metrics["retry_count"],
        promptVersion=metrics["prompt_version"],
        promptTemplateName=metrics["prompt_template_name"],
        jsonValidationStatus=metrics["json_validation_status"],
    )

    fallback_message = None
    if result["fallback_triggered"]:
        fallback_message = (
            f"Fell back to {result['model_used']}. "
            f"Reason: {result['fallback_reason']}"
        )

    return AnalyzeResponse(
        analysis=analysis_out,
        metrics=metrics_out,
        fallback_message=fallback_message,
    )


@app.get("/api/history", response_model=list[AnalysisHistoryItem])
async def get_history(
    session: AsyncSession = Depends(db.get_session),
) -> list[AnalysisHistoryItem]:
    """Return the 50 most recent analyses (summary view)."""
    stmt = (
        select(db.Analysis)
        .order_by(db.Analysis.created_at.desc())
        .limit(50)
    )
    result = await session.execute(stmt)
    rows = result.scalars().all()

    items: list[AnalysisHistoryItem] = []
    for row in rows:
        ats_overall = None
        if isinstance(row.analysis_json, dict):
            ats_score = row.analysis_json.get("atsScore")
            if isinstance(ats_score, dict):
                ats_overall = ats_score.get("overall")

        items.append(
            AnalysisHistoryItem(
                id=row.id,
                filename=row.filename,
                file_type=row.file_type,
                created_at=row.created_at.isoformat() if row.created_at else "",
                ats_score_overall=ats_overall,
            )
        )
    return items


@app.get("/api/analysis/{analysis_id}")
async def get_analysis(
    analysis_id: str,
    session: AsyncSession = Depends(db.get_session),
) -> dict:
    """Return full analysis + metrics for a specific analysis."""
    stmt = select(db.Analysis).where(db.Analysis.id == analysis_id)
    result = await session.execute(stmt)
    analysis = result.scalar_one_or_none()

    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found.")

    # Fetch associated metrics
    m_stmt = (
        select(db.AnalysisMetric)
        .where(db.AnalysisMetric.analysis_id == analysis_id)
        .order_by(db.AnalysisMetric.timestamp.desc())
        .limit(1)
    )
    m_result = await session.execute(m_stmt)
    metric = m_result.scalar_one_or_none()

    metric_data = None
    if metric:
        metric_data = {
            "requestId": metric.request_id,
            "timestamp": metric.timestamp,
            "modelUsed": metric.model_used,
            "fallbackTriggered": metric.fallback_triggered,
            "fallbackReason": metric.fallback_reason,
            "promptTokens": metric.prompt_tokens,
            "completionTokens": metric.completion_tokens,
            "totalTokens": metric.total_tokens,
            "estimatedCostUsd": metric.estimated_cost_usd,
            "latencyMs": metric.latency_ms,
            "timeToFirstTokenMs": metric.time_to_first_token_ms,
            "responseStatus": metric.response_status,
            "retryCount": metric.retry_count,
            "promptVersion": metric.prompt_version,
            "promptTemplateName": metric.prompt_template_name,
            "jsonValidationStatus": metric.json_validation_status,
        }

    return {
        "id": analysis.id,
        "filename": analysis.filename,
        "file_type": analysis.file_type,
        "resume_text": analysis.resume_text,
        "job_description": analysis.job_description,
        "analysis_json": analysis.analysis_json,
        "metrics": metric_data,
        "created_at": analysis.created_at.isoformat() if analysis.created_at else None,
    }


@app.delete("/api/analysis/{analysis_id}")
async def delete_analysis(
    analysis_id: str,
    session: AsyncSession = Depends(db.get_session),
) -> dict:
    """Delete an analysis and its associated metrics."""
    stmt = select(db.Analysis).where(db.Analysis.id == analysis_id)
    result = await session.execute(stmt)
    analysis = result.scalar_one_or_none()

    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found.")

    # Delete metrics first (cascade should handle this, but be explicit)
    del_m = delete(db.AnalysisMetric).where(db.AnalysisMetric.analysis_id == analysis_id)
    await session.execute(del_m)

    # Delete the analysis
    await session.delete(analysis)
    await session.flush()

    return {"status": "deleted", "id": analysis_id}


@app.get("/api/health")
async def health_check() -> dict:
    """Liveness / readiness endpoint."""
    return {
        "status": "ok",
        "models": [m["label"] for m in MODEL_CONFIGS],
    }