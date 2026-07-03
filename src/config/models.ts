// These models are now handled by the backend, but we keep
// the config for reference and any frontend-side display needs.

const MODEL_CONFIGS = [
  {
    id: 'z-ai/glm-5.2',
    label: 'GLM 5.2 (Z-AI)',
  },
  {
    id: 'minimaxai/minimax-m3',
    label: 'MiniMax M3',
  },
  {
    id: 'nvidia/nemotron-3-ultra-550b-a55b',
    label: 'Nemotron 3 Ultra 550B (NVIDIA)',
  },
] as const;

export const BASE_URL = 'https://integrate.api.nvidia.com/v1';
export const PROMPT_VERSION = 'v1.0';
export const PROMPT_TEMPLATE_NAME = 'resume-analysis-full';
export const MAX_FILE_SIZE_MB = 10;
export const MIN_EXTRACTED_TEXT_LENGTH = 50;
export const API_BASE = '/api';

export type ModelConfig = (typeof MODEL_CONFIGS)[number];

export function getModelChain(): readonly ModelConfig[] {
  return MODEL_CONFIGS;
}