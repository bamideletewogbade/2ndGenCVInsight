import type { MetricGlossary } from '@/types/glossary';

export const metricGlossary: MetricGlossary = {
  // === AI Request Insights ===
  'model-used': {
    definition: 'The specific AI model that processed your request.',
    whyItMatters: 'Different models have different strengths, speeds, and costs. Knowing which one was used helps evaluate the results.',
  },
  'fallback-triggered': {
    definition: 'Whether the system had to switch to a backup AI model because the primary one failed.',
    whyItMatters: 'Fallback chains are a production reliability pattern — if one model is down or slow, the system automatically tries the next.',
  },
  'fallback-reason': {
    definition: 'The specific reason the primary model was skipped — such as a timeout or invalid response.',
    whyItMatters: 'This helps engineers diagnose whether the issue was the model, the network, or the request itself.',
  },
  'request-id': {
    definition: 'A unique identifier for this specific AI request.',
    whyItMatters: 'In production systems, request IDs let you trace and debug individual interactions in logs.',
  },
  'timestamp': {
    definition: 'The exact date and time the AI request was made.',
  },
  'prompt-tokens': {
    definition: 'The number of text units the AI had to read — your resume text plus the instructions.',
    whyItMatters: 'More input tokens means higher cost and usually longer processing time.',
  },
  'completion-tokens': {
    definition: 'The number of text units the AI generated in its response.',
    whyItMatters: 'More output tokens means higher cost. Concise AI responses save money at scale.',
  },
  'total-tokens': {
    definition: 'Prompt tokens plus completion tokens — the total text processed in this request.',
    whyItMatters: 'This is the primary driver of cost for AI systems. Reducing total tokens directly reduces spend.',
  },
  'estimated-cost': {
    definition: 'The calculated cost based on published token pricing for this model family.',
    whyItMatters: 'This is a reference estimate, not an actual charge — these models are on a free tier. In production, this number would be your real bill.',
  },
  'latency': {
    definition: 'Total time from sending the request to receiving the complete response.',
    whyItMatters: 'Users notice anything above ~2 seconds. Production systems optimize for low latency to maintain experience quality.',
  },
  'ttft': {
    definition: 'Time to First Token — how long before the AI started generating its response.',
    whyItMatters: "This is simulated for this demo since we're not using streaming. In production, a low TTFT makes the AI feel responsive even if the full response takes longer.",
  },
  'response-status': {
    definition: 'Whether the AI returned a complete, partial, or failed response.',
  },
  'retry-count': {
    definition: 'How many times the system had to retry the request with a different model.',
    whyItMatters: 'Retries indicate instability. In production, high retry rates signal a problem that needs engineering attention.',
  },
  'prompt-version': {
    definition: 'The version number of the instructions sent to the AI.',
    whyItMatters: 'Prompt versioning lets teams track which instructions produced which results — essential for debugging and improving AI quality over time.',
  },
  'prompt-template-name': {
    definition: 'The name of the prompt template used for this request.',
    whyItMatters: 'Different tasks use different prompts. Tracking which template was used helps teams understand and optimize AI behavior.',
  },
  'json-validation': {
    definition: "Whether the AI's response was valid, structured JSON — not garbled text or partial output.",
    whyItMatters: 'AI models sometimes return broken JSON. Validation checks catch this and trigger retries, ensuring the application doesn\'t crash.',
  },

  // === ATS Score ===
  'ats-overall': {
    definition: "An estimated score of how well this resume might pass through Applicant Tracking System software.",
    whyItMatters: "Most large companies use ATS to filter resumes before a human sees them. A low score means your resume might never be read.",
  },
  'ats-formatting': {
    definition: "How well the resume's structure works with automated parsing — headings, sections, date formats.",
    whyItMatters: 'ATS software needs clean formatting to correctly extract your information. Complex layouts often break parsers.',
  },
  'ats-keywords': {
    definition: 'How well the resume matches relevant keywords for the role — both explicit and implied.',
    whyItMatters: 'Many ATS systems rank resumes by keyword match. Missing key terms can sink your application even if you\'re qualified.',
  },
  'ats-readability': {
    definition: 'How clearly the resume communicates — sentence complexity, jargon level, conciseness.',
    whyItMatters: 'Recruiters spend ~7 seconds on an initial scan. If your resume isn\'t immediately readable, key details get missed.',
  },
  'ats-experience': {
    definition: 'How well the work experience section demonstrates relevant depth and progression.',
    whyItMatters: 'ATS systems and recruiters both look for clear evidence of applicable experience — not just job titles, but impact and scope.',
  },
  'ats-skills': {
    definition: 'How comprehensively relevant skills are represented — both technical and non-technical.',
    whyItMatters: 'Skills sections are often the most heavily weighted ATS field. Missing or mislabeled skills directly hurt your score.',
  },
  'ats-consistency': {
    definition: 'How consistent the resume is internally — dates, formatting, terminology, tense usage.',
    whyItMatters: 'Inconsistencies (mixed date formats, switching tenses) look unprofessional and can confuse both ATS and human reviewers.',
  },

  // === Missing Skills ===
  'match-percentage': {
    definition: "The percentage overlap between your resume's skills and the job description's requirements.",
    whyItMatters: "This is a rough indicator of how closely you match what the employer is asking for — but it's not the whole picture.",
  },

  // === Confidence ===
  'confidence-score': {
    definition: 'How confident the AI is in this specific assessment, based on the clarity and completeness of the resume text.',
    whyItMatters: 'Low confidence means the resume may have been hard to parse or was missing information — treat those suggestions with extra scrutiny.',
  },

  // === Responsible AI ===
  'privacy-data-detected': {
    definition: 'The AI scanned for personally identifiable information such as phone numbers, emails, and addresses.',
    whyItMatters: 'This check helps users be aware of what personal data is in their resume before sharing it further.',
  },
  'privacy-sensitive-info': {
    definition: 'The AI checked for sensitive information like exact street addresses, social security numbers, or birth dates.',
    whyItMatters: "Sensitive data doesn't belong on a resume. This flag helps users remove it before applying.",
  },
  'privacy-session-storage': {
    definition: 'Your resume text is only held in browser memory during this session. It is not sent anywhere except the AI model, and it is not stored on any server.',
    whyItMatters: 'Session-only storage means your data disappears when you close the tab. No persistent database, no logs, no residual copies.',
  },
  'fairness-no-protected-attributes': {
    definition: 'The AI was instructed to ignore name, age, gender, ethnicity, and other protected characteristics in its analysis.',
    whyItMatters: 'AI can inadvertently learn biases from training data. Explicit instructions help ensure recommendations are based only on professional qualifications.',
  },
  'fairness-job-related-only': {
    definition: 'All feedback is based on job-relevant criteria: skills, experience, and presentation.',
    whyItMatters: "This ensures the AI isn't making recommendations influenced by irrelevant personal characteristics.",
  },
  'transparency-ai-generated': {
    definition: 'All recommendations on this page were generated by AI, not a human career coach.',
    whyItMatters: 'You should know when you\'re receiving AI-generated advice so you can apply your own judgment accordingly.',
  },
  'transparency-human-review': {
    definition: 'We recommend reviewing AI suggestions with a human before making major resume changes.',
    whyItMatters: 'AI can miss context, misinterpret experience, or suggest changes that don\'t fit your actual career narrative.',
  },
  'governance-audit-log': {
    definition: 'A record of this analysis session — what model was used, when, and what was requested — is viewable in the AI Request Insights panel.',
    whyItMatters: 'Audit trails are a governance best practice. They let anyone see exactly what the AI did and why.',
  },
  'governance-prompt-version': {
    definition: 'The specific version of instructions used for this analysis is recorded and displayed.',
    whyItMatters: 'If a prompt produces bad results, version tracking lets teams pinpoint exactly which version caused the issue and roll back.',
  },
  'governance-model-version': {
    definition: 'The exact AI model and version that generated this analysis is recorded.',
    whyItMatters: 'Different model versions produce different outputs. Recording this enables reproducibility and debugging.',
  },
  'risk-assessment': {
    definition: 'An overall risk rating for this AI interaction — how likely the output could contain errors, biases, or inappropriate content.',
    whyItMatters: 'Low risk means the AI had clear input and produced well-structured output. Higher risk flags mean you should review more carefully.',
  },
};