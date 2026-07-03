const MODEL_CONFIGS = [
  {
    id: 'meta/llama-3.1-70b-instruct',
    timeoutMs: 20000,
    label: 'Llama 3.1 70B (Meta)',
  },
  {
    id: 'mistralai/mixtral-8x22b-instruct-v0.1',
    timeoutMs: 25000,
    label: 'Mixtral 8x22B (Mistral)',
  },
  {
    id: 'nvidia/llama-3.1-nemotron-70b-instruct',
    timeoutMs: 25000,
    label: 'Llama 3.1 Nemotron 70B (NVIDIA)',
  },
] as const;

export const BASE_URL = 'https://integrate.api.nvidia.com/v1';
export const PROMPT_VERSION = 'v1.0';
export const PROMPT_TEMPLATE_NAME = 'resume-analysis-full';
export const MAX_FILE_SIZE_MB = 10;
export const MIN_EXTRACTED_TEXT_LENGTH = 50;

export type ModelConfig = (typeof MODEL_CONFIGS)[number];

export function getModelChain(): readonly ModelConfig[] {
  return MODEL_CONFIGS;
}

export function getApiKey(): string | undefined {
  return import.meta.env.VITE_NVIDIA_API_KEY;
}