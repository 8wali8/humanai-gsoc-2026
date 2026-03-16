import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";

import type { DecisionEvent } from "@/lib/types";

export const DATA_DIRECTORY = path.join(process.cwd(), "data");
export const LOG_FILE_PATH = path.join(DATA_DIRECTORY, "logs.jsonl");

export async function appendDecisionEvent(event: DecisionEvent): Promise<void> {
  await mkdir(DATA_DIRECTORY, { recursive: true });
  await appendFile(LOG_FILE_PATH, `${JSON.stringify(event)}\n`, "utf8");
}
