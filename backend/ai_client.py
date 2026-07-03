"""Async NVIDIA NIM client with 3-model fallback chain.

Ported from the TypeScript ai-client.ts and cost-calculator.ts modules.
"""

from __future__ import annotations

import asyncio
import json
import re
import time
import uuid

import httpx

from config import BASE_URL, MODEL_CONFIGS, MODEL_PRICING, NVIDIA_API_KEY, PROMPT_TEMPLATE_NAME, PROMPT_VERSION

# Required top-level keys in the AI JSON response
REQUIRED_TOP_KEYS = ["summary", "skills", "strengths", "improvements", "atsScore"]


class APIKeyMissingError(Exception):
    """Raised when NVIDIA_API_KEY is not configured."""

    pass


class APIKeyInvalidError(Exception):
    """Raised when the API returns 401."""

    pass


class RateLimitError(Exception):
    """Raised when the API returns 429."""

    pass


class AllModelsFailedError(Exception):
    """Raised when every model in the fallback chain fails."""

    pass


# ── JSON extraction helpers ────────────────────────────────────────────────


def _extract_json_from_response(text: str) -> str:
    """Try markdown fences first, then brace matching, then raw text."""
    # 1. Markdown code fences: ```json ... ```  or  ``` ... ```
    fence_match = re.search(r"```(?:json)?\s*\n?([\s\S]*?)\n?```", text)
    if fence_match:
        return fence_match.group(1).strip()

    # 2. First outermost { ... } pair
    brace_match = re.search(r"(\{[\s\S]*\})", text)
    if brace_match:
        return brace_match.group(1).strip()

    return text.strip()


def _validate_json_structure(obj: object, required_keys: list[str]) -> bool:
    """Return True if *obj* is a dict containing every required key."""
    if not isinstance(obj, dict):
        return False
    return all(key in obj for key in required_keys)


# ── Cost / TTFT helpers ───────────────────────────────────────────────────


def calculate_cost(model_id: str, prompt_tokens: int, completion_tokens: int) -> float:
    """Return estimated cost in USD for the given token usage."""
    pricing = MODEL_PRICING.get(model_id)
    if not pricing:
        return 0.0
    input_cost = (prompt_tokens / 1_000_000) * pricing["input"]
    output_cost = (completion_tokens / 1_000_000) * pricing["output"]
    return round(input_cost + output_cost, 8)


def simulate_ttft(latency_ms: int, total_tokens: int) -> int:
    """Rough heuristic: first token arrives ~15 % into total latency."""
    _ = total_tokens  # kept for API symmetry
    return round(latency_ms * 0.15)


# ── Metrics builder ───────────────────────────────────────────────────────


def build_metrics(
    result: dict,
    prompt_version: str = PROMPT_VERSION,
    prompt_template_name: str = PROMPT_TEMPLATE_NAME,
) -> dict:
    """Build a metrics dict suitable for both the API response and DB storage."""
    total_tokens = result["prompt_tokens"] + result["completion_tokens"]
    return {
        "request_id": str(uuid.uuid4()),
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%S.000Z", time.gmtime()),
        "model_used": result["model_used"],
        "fallback_triggered": result["fallback_triggered"],
        "fallback_reason": result["fallback_reason"],
        "prompt_tokens": result["prompt_tokens"],
        "completion_tokens": result["completion_tokens"],
        "total_tokens": total_tokens,
        "estimated_cost_usd": calculate_cost(
            result["model_used"],
            result["prompt_tokens"],
            result["completion_tokens"],
        ),
        "latency_ms": result["latency_ms"],
        "time_to_first_token_ms": simulate_ttft(result["latency_ms"], total_tokens),
        "response_status": "success",
        "retry_count": result["retry_count"],
        "prompt_version": prompt_version,
        "prompt_template_name": prompt_template_name,
        "json_validation_status": result["json_validation_status"],
    }


# ── Main LLM call with fallback ────────────────────────────────────────────


async def call_llm(
    system_prompt: str,
    user_prompt: str,
    required_keys: list[str] | None = None,
) -> dict:
    """Call NVIDIA NIM with a 3-model fallback chain.

    Returns a dict with keys:
        content, parsed, model_used, fallback_triggered, fallback_reason,
        retry_count, prompt_tokens, completion_tokens, latency_ms,
        json_validation_status
    """
    if not NVIDIA_API_KEY:
        raise APIKeyMissingError("NVIDIA_API_KEY is not set")

    models = MODEL_CONFIGS
    req_keys = required_keys or REQUIRED_TOP_KEYS
    last_error: Exception | None = None
    retry_count = 0

    async with httpx.AsyncClient(timeout=None) as client:
        for idx, model in enumerate(models):
            model_id = model["id"]
            timeout_ms = model["timeout_ms"]

            try:
                start = time.monotonic()

                response = await asyncio.wait_for(
                    client.post(
                        f"{BASE_URL}/chat/completions",
                        headers={
                            "Authorization": f"Bearer {NVIDIA_API_KEY}",
                            "Content-Type": "application/json",
                        },
                        json={
                            "model": model_id,
                            "messages": [
                                {"role": "system", "content": system_prompt},
                                {"role": "user", "content": user_prompt},
                            ],
                            "temperature": 0.3,
                            "max_tokens": 4096,
                        },
                    ),
                    timeout=timeout_ms / 1000,
                )

                latency_ms = int((time.monotonic() - start) * 1000)

                # Handle HTTP-level errors
                if response.status_code == 401:
                    raise APIKeyInvalidError("API key is invalid (401)")
                if response.status_code == 429:
                    raise RateLimitError("Rate limited (429)")
                if response.status_code >= 400:
                    raise RuntimeError(
                        f"API returned {response.status_code}: {response.text[:200]}"
                    )

                body = response.json()
                content = (
                    body.get("choices", [{}])[0]
                    .get("message", {})
                    .get("content", "")
                )
                usage = body.get("usage", {})
                prompt_tokens = usage.get("prompt_tokens", 0)
                completion_tokens = usage.get("completion_tokens", 0)

                # ── Try direct JSON parse ───────────────────────────────
                try:
                    parsed = json.loads(content)
                    if _validate_json_structure(parsed, req_keys):
                        return {
                            "content": content,
                            "parsed": parsed,
                            "model_used": model_id,
                            "fallback_triggered": idx > 0,
                            "fallback_reason": (
                                (last_error.args[0] if last_error else "Previous model failed")
                                if idx > 0
                                else None
                            ),
                            "retry_count": retry_count,
                            "prompt_tokens": prompt_tokens,
                            "completion_tokens": completion_tokens,
                            "latency_ms": latency_ms,
                            "json_validation_status": "valid",
                        }
                except (json.JSONDecodeError, TypeError):
                    pass

                # ── Try extraction (fences / brace matching) ────────────
                extracted = _extract_json_from_response(content)
                try:
                    parsed = json.loads(extracted)
                    if _validate_json_structure(parsed, req_keys):
                        return {
                            "content": content,
                            "parsed": parsed,
                            "model_used": model_id,
                            "fallback_triggered": idx > 0,
                            "fallback_reason": (
                                (last_error.args[0] if last_error else "Previous model failed")
                                if idx > 0
                                else None
                            ),
                            "retry_count": retry_count,
                            "prompt_tokens": prompt_tokens,
                            "completion_tokens": completion_tokens,
                            "latency_ms": latency_ms,
                            "json_validation_status": "retried",
                        }
                except (json.JSONDecodeError, TypeError):
                    pass

                # JSON validation failed for this model — try next
                last_error = RuntimeError(
                    f"JSON validation failed for model {model_id}"
                )
                retry_count += 1
                continue

            except (APIKeyInvalidError, APIKeyMissingError):
                # Fatal — re-raise immediately
                raise

            except asyncio.TimeoutError:
                retry_count += 1
                last_error = RuntimeError(f"Timeout after {timeout_ms}ms on {model_id}")
                if idx == len(models) - 1:
                    raise AllModelsFailedError(
                        f"All models failed. Last error: {last_error}"
                    ) from last_error
                continue

            except RateLimitError as exc:
                retry_count += 1
                last_error = exc
                if idx == len(models) - 1:
                    raise AllModelsFailedError(
                        f"All models failed. Last error: {exc}"
                    ) from exc
                continue

            except Exception as exc:
                retry_count += 1
                last_error = exc
                if idx == len(models) - 1:
                    raise AllModelsFailedError(
                        f"All models failed. Last error: {exc}"
                    ) from exc
                continue

    # Unreachable, but satisfy type checkers
    raise AllModelsFailedError("All AI models failed. " + (last_error.args[0] if last_error else "Unknown reason"))