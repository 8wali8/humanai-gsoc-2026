import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { exportEventsToCsv } from "../lib/exportCsv";
import type { DecisionEvent } from "../lib/types";

async function main() {
  const sampleJsonlPath = path.join(process.cwd(), "data", "sample_output.jsonl");
  const sampleCsvPath = path.join(process.cwd(), "data", "sample_output.csv");

  const rawJsonl = await readFile(sampleJsonlPath, "utf8");
  const events = rawJsonl
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line) as DecisionEvent);
  const csv = exportEventsToCsv(events);

  await writeFile(sampleCsvPath, csv, "utf8");
}

main().catch((error) => {
  console.error("Failed to generate sample CSV:", error);
  process.exitCode = 1;
});
