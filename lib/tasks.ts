import type { TaskConfig } from "@/lib/types";

export const TASKS: TaskConfig[] = [
  {
    id: "travel-reimbursement-review",
    title: "Hotel reimbursement request",
    scenario:
      "A teammate submitted a hotel expense for $184 after a two-day client visit. The trip was pre-approved, the receipt is legible, and the company reimbursement cap is $220 per night. The traveler added a note that they checked in late after a flight delay.",
    decisionPrompt: "What decision would you make for this request?",
    recommendationText: "Approve the reimbursement.",
    acceptLabel: "Follow recommendation",
    overrideLabel: "Choose a different action",
  },
];

export const ACTIVE_TASK_ID = TASKS[0].id;

export function getActiveTask(): TaskConfig {
  return TASKS[0];
}

export function getTaskById(taskId: string): TaskConfig | undefined {
  return TASKS.find((task) => task.id === taskId);
}
