import type { DecisionEvent, LogApiResponse } from "@/lib/types";

export async function submitDecisionEvent(event: DecisionEvent): Promise<void> {
  const response = await fetch("/api/log", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
    body: JSON.stringify(event),
  });

  const payload = (await response.json()) as LogApiResponse;

  if (!response.ok || !payload.ok) {
    throw new Error(payload.ok ? "The log request failed." : payload.error);
  }
}
