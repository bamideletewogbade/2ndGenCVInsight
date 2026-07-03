"""Prompt templates ported from the frontend TypeScript source."""

import warnings

from config import PROMPT_VERSION, PROMPT_TEMPLATE_NAME

__all__ = ["get_system_prompt", "build_analysis_user_prompt"]


def get_system_prompt() -> str:
    return (
        "You are an expert resume analyst and career consultant. You analyze resumes "
        "and provide structured, actionable feedback.\n\n"
        "STRICT RULES:\n"
        "- Return ONLY valid JSON matching the provided schema. No markdown, no commentary, no code fences.\n"
        "- Base ALL assessments exclusively on the text provided. Never invent or assume information.\n"
        "- Be specific and evidence-based. Reference actual content from the resume.\n"
        "- Scores should be honest and calibrated: most real resumes score 50-75 on ATS. Perfect 100s are rare.\n"
        '- For the "improvements" array, each item should be a specific, actionable recommendation, not vague advice.\n'
        '- For "strengths", cite what in the resume supports each point.\n'
        '- Categorize skills accurately. When uncertain, use "Tools" as the default category.\n'
        "- If a job description is provided, the missingSkills analysis must compare ONLY what's in the resume vs. the job description."
    )


def build_analysis_user_prompt(
    resume_text: str, job_description: str | None = None
) -> str:
    prompt = (
        "Analyze the following resume text and return a JSON object with this exact structure:\n"
        "{summary: {overview: string, yearsOfExperience: number, careerProgression: string[], "
        "strongestQualifications: string[]}, skills: [{category: string, items: string[]}], "
        "strengths: string[], improvements: string[], "
        "atsScore: {overall: number, breakdown: {formatting: number, keywords: number, "
        "readability: number, experience: number, skills: number, consistency: number}, notes: string}}"
    )

    if job_description:
        prompt += (
            ", missingSkills: {technologies: string[], certifications: string[], "
            "softSkills: string[], matchPercentage: number, recommendations: string[]}"
        )

    prompt += f"\n\nRESUME TEXT:\n{resume_text}"

    if job_description:
        prompt += f"\n\nTARGET JOB DESCRIPTION:\n{job_description}"

    return prompt


# Suppress unused-import warnings — these are imported by other modules
_PV = PROMPT_VERSION  # noqa: F841
_PTN = PROMPT_TEMPLATE_NAME  # noqa: F841