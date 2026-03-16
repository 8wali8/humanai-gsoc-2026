import type { DecisionEvent } from "./types";

const CSV_COLUMNS: Array<keyof DecisionEvent> = [
  "participant_id",
  "condition",
  "condition_label",
  "task_id",
  "task_title",
  "decision",
  "timestamp",
  "latency_ms",
  "assistant_name",
  "tone_label",
  "recommendation_text",
];

function escapeCsvValue(value: string | number): string {
  const normalizedValue = String(value);

  if (/[",\n]/.test(normalizedValue)) {
    return `"${normalizedValue.replaceAll('"', '""')}"`;
  }

  return normalizedValue;
}

export function exportEventsToCsv(events: DecisionEvent[]): string {
  const rows = [
    CSV_COLUMNS.join(","),
    ...events.map((event) =>
      CSV_COLUMNS.map((column) => escapeCsvValue(event[column])).join(","),
    ),
  ];

  return `${rows.join("\n")}\n`;
}
