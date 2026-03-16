export type ConditionId = "A" | "B";

export type Decision = "accept" | "override";

export type ExperimentPhase =
  | "loading"
  | "ready"
  | "submitting"
  | "success"
  | "error";

export interface ConditionConfig {
  id: ConditionId;
  label: string;
  assistantName: string;
  roleLabel: string;
  toneLabel: string;
  bannerText: string;
  recommendationFraming: string;
  accentColor: string;
  surfaceColor: string;
}

export interface TaskConfig {
  id: string;
  title: string;
  scenario: string;
  decisionPrompt: string;
  recommendationText: string;
  acceptLabel: string;
  overrideLabel: string;
}

export interface ParticipantSession {
  participantId: string;
  conditionId: ConditionId;
}

export interface DecisionEvent {
  participant_id: string;
  condition: ConditionId;
  condition_label: string;
  task_id: string;
  task_title: string;
  decision: Decision;
  timestamp: string;
  latency_ms: number;
  assistant_name: string;
  tone_label: string;
  recommendation_text: string;
}

export interface ValidationSuccess<T> {
  ok: true;
  value: T;
}

export interface ValidationFailure {
  ok: false;
  error: string;
}

export type ValidationResult<T> = ValidationSuccess<T> | ValidationFailure;

export interface LogSuccessResponse {
  ok: true;
  message: string;
}

export interface LogErrorResponse {
  ok: false;
  error: string;
}

export type LogApiResponse = LogSuccessResponse | LogErrorResponse;
