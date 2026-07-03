"""Pydantic schemas matching the frontend TypeScript types exactly."""

from __future__ import annotations

from pydantic import BaseModel


# ── Analysis response sub-models ──────────────────────────────────────────


class ATSScoreBreakdown(BaseModel):
    formatting: int
    keywords: int
    readability: int
    experience: int
    skills: int
    consistency: int


class ATSScore(BaseModel):
    overall: int
    breakdown: ATSScoreBreakdown
    notes: str


class MissingSkills(BaseModel):
    technologies: list[str]
    certifications: list[str]
    softSkills: list[str]
    matchPercentage: int
    recommendations: list[str]


class ResumeSummary(BaseModel):
    overview: str
    yearsOfExperience: int
    careerProgression: list[str]
    strongestQualifications: list[str]


class SkillCategory(BaseModel):
    category: str
    items: list[str]


class AnalysisResponse(BaseModel):
    summary: ResumeSummary
    skills: list[SkillCategory]
    strengths: list[str]
    improvements: list[str]
    atsScore: ATSScore
    missingSkills: MissingSkills | None = None


# ── Metrics ───────────────────────────────────────────────────────────────


class AIRequestMetrics(BaseModel):
    requestId: str
    timestamp: str
    modelUsed: str
    fallbackTriggered: bool
    fallbackReason: str | None
    promptTokens: int
    completionTokens: int
    totalTokens: int
    estimatedCostUsd: float
    latencyMs: int
    timeToFirstTokenMs: int
    responseStatus: str  # 'success' | 'partial' | 'failed'
    retryCount: int
    promptVersion: str
    promptTemplateName: str
    jsonValidationStatus: str  # 'valid' | 'failed' | 'retried'


# ── Request / Response wrappers ───────────────────────────────────────────


class AnalyzeRequest(BaseModel):
    job_description: str | None = None


class AnalyzeResponse(BaseModel):
    analysis: AnalysisResponse
    metrics: AIRequestMetrics
    fallback_message: str | None = None


class AnalysisHistoryItem(BaseModel):
    id: str
    filename: str
    file_type: str
    created_at: str
    ats_score_overall: int | None = None


class ErrorResponse(BaseModel):
    error: str
    type: str