export interface GlossaryEntry {
  definition: string;
  whyItMatters?: string;
}

export type MetricGlossary = Record<string, GlossaryEntry>;