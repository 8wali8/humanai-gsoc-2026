import { NextResponse } from "next/server";

import { appendDecisionEvent } from "@/lib/fileStorage";
import { validateDecisionEvent } from "@/lib/validation";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Request body must contain valid JSON." },
      { status: 400 },
    );
  }

  const validationResult = validateDecisionEvent(payload);

  if (!validationResult.ok) {
    return NextResponse.json(
      { ok: false, error: validationResult.error },
      { status: 400 },
    );
  }

  try {
    await appendDecisionEvent(validationResult.value);
  } catch {
    return NextResponse.json(
      { ok: false, error: "Failed to append the event to the local log file." },
      { status: 500 },
    );
  }

  return NextResponse.json(
    { ok: true, message: "Event logged successfully." },
    { status: 200 },
  );
}
