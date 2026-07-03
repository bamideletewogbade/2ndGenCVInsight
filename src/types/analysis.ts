export interface SkillCategory {
  category: string;
  items: string[];
}

export interface ATSScoreBreakdown {
  formatting: number;
  keywords: number;
  readability: number;
  experience: number;
  skills: number;
  consistency: number;
}

export interface ATSScore {
  overall: number;
  breakdown: ATSScoreBreakdown;
  notes: string;
}

export interface MissingSkills {
  technologies: string[];
  certifications: string[];
  softSkills: string[];
  matchPercentage: number;
  recommendations: string[];
}

export interface ResumeSummary {
  overview: string;
  yearsOfExperience: number;
  careerProgression: string[];
  strongestQualifications: string[];
}

export interface AnalysisResponse {
  summary: ResumeSummary;
  skills: SkillCategory[];
  strengths: string[];
  improvements: string[];
  atsScore: ATSScore;
  missingSkills?: MissingSkills;
}