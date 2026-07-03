export function getSystemPrompt(): string {
  return `You are an expert resume analyst and career consultant. You analyze resumes and provide structured, actionable feedback.

STRICT RULES:
- Return ONLY valid JSON matching the provided schema. No markdown, no commentary, no code fences.
- Base ALL assessments exclusively on the text provided. Never invent or assume information.
- Be specific and evidence-based. Reference actual content from the resume.
- Scores should be honest and calibrated: most real resumes score 50-75 on ATS. Perfect 100s are rare.
- For the "improvements" array, each item should be a specific, actionable recommendation, not vague advice.
- For "strengths", cite what in the resume supports each point.
- Categorize skills accurately. When uncertain, use "Tools" as the default category.
- If a job description is provided, the missingSkills analysis must compare ONLY what's in the resume vs. the job description.`;
}

export function buildAnalysisUserPrompt(
  resumeText: string,
  jobDescriptionText?: string
): string {
  let prompt = `Analyze the following resume text and return a JSON object with this exact structure:
{summary: {overview: string, yearsOfExperience: number, careerProgression: string[], strongestQualifications: string[]}, skills: [{category: string, items: string[]}], strengths: string[], improvements: string[], atsScore: {overall: number, breakdown: {formatting: number, keywords: number, readability: number, experience: number, skills: number, consistency: number}, notes: string}}`;

  if (jobDescriptionText) {
    prompt += `, missingSkills: {technologies: string[], certifications: string[], softSkills: string[], matchPercentage: number, recommendations: string[]}`;
  }

  prompt += `\n\nRESUME TEXT:\n${resumeText}`;

  if (jobDescriptionText) {
    prompt += `\n\nTARGET JOB DESCRIPTION:\n${jobDescriptionText}`;
  }

  return prompt;
}