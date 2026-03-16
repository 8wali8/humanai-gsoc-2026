import { isConditionId } from "@/lib/conditions";
import type { ConditionId, ParticipantSession } from "@/lib/types";

const PARTICIPANT_ID_KEY = "humanai.participant_id";
const CONDITION_ID_KEY = "humanai.condition_id";

function canUseBrowserStorage(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function createParticipantId(): string {
  const dateSegment = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  const randomSegment =
    typeof window !== "undefined" &&
    typeof window.crypto !== "undefined" &&
    typeof window.crypto.randomUUID === "function"
      ? window.crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10);

  return `p_${dateSegment}_${randomSegment}`;
}

function pickRandomCondition(): ConditionId {
  return Math.random() < 0.5 ? "A" : "B";
}

function readStoredValue(key: string): string | null {
  if (!canUseBrowserStorage()) {
    return null;
  }

  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStoredValue(key: string, value: string): void {
  if (!canUseBrowserStorage()) {
    return;
  }

  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Ignore storage failures so local experimentation still proceeds.
  }
}

export function resolveConditionOverride(
  search: string = typeof window !== "undefined" ? window.location.search : "",
): ConditionId | null {
  if (!search) {
    return null;
  }

  const params = new URLSearchParams(search);
  const overrideValue = params.get("condition");

  if (!overrideValue || !isConditionId(overrideValue)) {
    return null;
  }

  return overrideValue;
}

export function getOrCreateParticipantId(): string {
  const storedParticipantId = readStoredValue(PARTICIPANT_ID_KEY);

  if (storedParticipantId) {
    return storedParticipantId;
  }

  const participantId = createParticipantId();
  writeStoredValue(PARTICIPANT_ID_KEY, participantId);

  return participantId;
}

export function getOrAssignCondition(
  search: string = typeof window !== "undefined" ? window.location.search : "",
): ConditionId {
  const overrideCondition = resolveConditionOverride(search);

  if (overrideCondition) {
    return overrideCondition;
  }

  const storedCondition = readStoredValue(CONDITION_ID_KEY);

  if (storedCondition && isConditionId(storedCondition)) {
    return storedCondition;
  }

  const assignedCondition = pickRandomCondition();
  writeStoredValue(CONDITION_ID_KEY, assignedCondition);

  return assignedCondition;
}

export function initializeParticipantSession(
  search: string = typeof window !== "undefined" ? window.location.search : "",
): ParticipantSession {
  return {
    participantId: getOrCreateParticipantId(),
    conditionId: getOrAssignCondition(search),
  };
}
