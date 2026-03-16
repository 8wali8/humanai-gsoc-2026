import { getConditionById, isConditionId } from "@/lib/conditions";
import { getTaskById } from "@/lib/tasks";
import type { DecisionEvent, Decision, ValidationResult } from "@/lib/types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isDecision(value: unknown): value is Decision {
  return value === "accept" || value === "override";
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isValidTimestamp(value: unknown): value is string {
  if (!isNonEmptyString(value)) {
    return false;
  }

  const parsedTimestamp = Date.parse(value);

  if (!Number.isFinite(parsedTimestamp)) {
    return false;
  }

  const year = new Date(parsedTimestamp).getUTCFullYear();
  return year >= 2020 && year <= 2100;
}

export function validateDecisionEvent(payload: unknown): ValidationResult<DecisionEvent> {
  if (!isRecord(payload)) {
    return { ok: false, error: "Request body must be a JSON object." };
  }

  const {
    participant_id,
    condition,
    condition_label,
    task_id,
    task_title,
    decision,
    timestamp,
    latency_ms,
    assistant_name,
    tone_label,
    recommendation_text,
  } = payload;

  const conditionId = typeof condition === "string" ? condition : "";

  if (!isNonEmptyString(participant_id)) {
    return { ok: false, error: "participant_id is required." };
  }

  if (!isConditionId(conditionId)) {
    return { ok: false, error: "condition must be either A or B." };
  }

  if (!isNonEmptyString(condition_label)) {
    return { ok: false, error: "condition_label is required." };
  }

  if (!isNonEmptyString(task_id)) {
    return { ok: false, error: "task_id is required." };
  }

  if (!isNonEmptyString(task_title)) {
    return { ok: false, error: "task_title is required." };
  }

  if (!isDecision(decision)) {
    return { ok: false, error: "decision must be accept or override." };
  }

  if (!isValidTimestamp(timestamp)) {
    return { ok: false, error: "timestamp must be a valid ISO-8601 string." };
  }

  if (typeof latency_ms !== "number" || !Number.isFinite(latency_ms) || latency_ms < 0) {
    return { ok: false, error: "latency_ms must be a non-negative number." };
  }

  if (!isNonEmptyString(assistant_name)) {
    return { ok: false, error: "assistant_name is required." };
  }

  if (!isNonEmptyString(tone_label)) {
    return { ok: false, error: "tone_label is required." };
  }

  if (!isNonEmptyString(recommendation_text)) {
    return { ok: false, error: "recommendation_text is required." };
  }

  const conditionConfig = getConditionById(conditionId);
  const taskConfig = getTaskById(task_id);

  if (!taskConfig) {
    return { ok: false, error: `Unknown task_id: ${task_id}` };
  }

  if (condition_label !== conditionConfig.label) {
    return { ok: false, error: "condition_label does not match the configured condition." };
  }

  if (assistant_name !== conditionConfig.assistantName) {
    return { ok: false, error: "assistant_name does not match the configured condition." };
  }

  if (tone_label !== conditionConfig.toneLabel) {
    return { ok: false, error: "tone_label does not match the configured condition." };
  }

  if (task_title !== taskConfig.title) {
    return { ok: false, error: "task_title does not match the configured task." };
  }

  if (recommendation_text !== taskConfig.recommendationText) {
    return { ok: false, error: "recommendation_text does not match the configured task." };
  }

  return {
    ok: true,
    value: {
      participant_id,
      condition: conditionId,
      condition_label,
      task_id,
      task_title,
      decision,
      timestamp,
      latency_ms,
      assistant_name,
      tone_label,
      recommendation_text,
    },
  };
}
