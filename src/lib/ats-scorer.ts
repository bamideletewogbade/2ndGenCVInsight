export function calculateATSSubScores(resumeText: string, _jobDescription?: string): {
  formatting: number;
  keywords: number;
  readability: number;
  experience: number;
  skills: number;
  consistency: number;
} {
  // These are placeholder scores — the real scores come from the LLM.
  // This helper exists to provide fallback display values if needed.
  const lines = resumeText.split('\n').filter((l) => l.trim().length > 0);
  const hasSections = /experience|education|skills|summary/i.test(resumeText);
  const hasBullets = /^[\s]*[-•*]/m.test(resumeText);
  const wordCount = resumeText.split(/\s+/).length;

  const formatting = Math.min(100, Math.max(20, 50 + (hasSections ? 20 : 0) + (hasBullets ? 15 : 0)));
  const keywords = Math.min(100, Math.max(30, 55 + (wordCount > 200 ? 15 : 0)));
  const readability = Math.min(100, Math.max(30, 60 + (lines.length > 10 ? 10 : 0)));
  const experience = Math.min(100, Math.max(20, 50 + (wordCount > 300 ? 20 : 0)));
  const skills = Math.min(100, Math.max(25, 45 + (hasSections ? 25 : 0)));
  const consistency = Math.min(100, Math.max(30, 70 - (lines.length % 7 === 0 ? 0 : 10)));

  return { formatting, keywords, readability, experience, skills, consistency };
}