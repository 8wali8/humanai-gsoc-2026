import type { ConditionConfig, ConditionId } from "@/lib/types";

export const CONDITIONS: ConditionConfig[] = [
  {
    id: "A",
    label: "Condition A: System-framed assistant",
    assistantName: "Decision Support Module",
    roleLabel: "Policy review assistant",
    toneLabel: "Neutral / formal",
    bannerText:
      "Recommendation generated from the submitted case details and the reimbursement policy.",
    recommendationFraming: "Recommended action",
    accentColor: "#38516B",
    surfaceColor: "#E9F1F6",
  },
  {
    id: "B",
    label: "Condition B: Humanlike assistant",
    assistantName: "Maya",
    roleLabel: "AI teammate",
    toneLabel: "Humanlike / conversational",
    bannerText:
      "I reviewed the trip details and policy notes to help you make the call, but the final decision is still yours.",
    recommendationFraming: "Maya suggests",
    accentColor: "#A14B2B",
    surfaceColor: "#FCEEE7",
  },
];

const CONDITION_MAP = new Map<ConditionId, ConditionConfig>(
  CONDITIONS.map((condition) => [condition.id, condition]),
);

export function getConditionById(id: ConditionId): ConditionConfig {
  const condition = CONDITION_MAP.get(id);

  if (!condition) {
    throw new Error(`Unknown condition: ${id}`);
  }

  return condition;
}

export function isConditionId(value: string): value is ConditionId {
  return value === "A" || value === "B";
}
