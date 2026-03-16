"use client";

import { useEffect, useState } from "react";

import { ConditionBanner } from "@/components/ConditionBanner";
import { DecisionTask } from "@/components/DecisionTask";
import { SubmissionState } from "@/components/SubmissionState";
import { getConditionById } from "@/lib/conditions";
import { submitDecisionEvent } from "@/lib/logger";
import { initializeParticipantSession } from "@/lib/participant";
import { getActiveTask } from "@/lib/tasks";
import type {
  ConditionConfig,
  Decision,
  DecisionEvent,
  ExperimentPhase,
  ParticipantSession,
  TaskConfig,
} from "@/lib/types";

export function ExperimentShell() {
  const [phase, setPhase] = useState<ExperimentPhase>("loading");
  const [session, setSession] = useState<ParticipantSession | null>(null);
  const [condition, setCondition] = useState<ConditionConfig | null>(null);
  const [task, setTask] = useState<TaskConfig | null>(null);
  const [pendingEvent, setPendingEvent] = useState<DecisionEvent | null>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const participantSession = initializeParticipantSession(window.location.search);

      setSession(participantSession);
      setCondition(getConditionById(participantSession.conditionId));
      setTask(getActiveTask());
      setPhase("ready");
    } catch (error) {
      setSubmissionError(
        error instanceof Error
          ? error.message
          : "Experiment setup failed before the task could be shown.",
      );
      setPhase("error");
    }
  }, []);

  async function persistDecision(event: DecisionEvent) {
    setPhase("submitting");
    setSubmissionError(null);

    try {
      await submitDecisionEvent(event);
      setPhase("success");
    } catch (error) {
      setSubmissionError(error instanceof Error ? error.message : "Unexpected logging error.");
      setPhase("error");
    }
  }

  async function handleDecision(decision: Decision, latencyMs: number) {
    if (!session || !condition || !task) {
      return;
    }

    const event: DecisionEvent = {
      participant_id: session.participantId,
      condition: condition.id,
      condition_label: condition.label,
      task_id: task.id,
      task_title: task.title,
      decision,
      timestamp: new Date().toISOString(),
      latency_ms: latencyMs,
      assistant_name: condition.assistantName,
      tone_label: condition.toneLabel,
      recommendation_text: task.recommendationText,
    };

    setPendingEvent(event);
    await persistDecision(event);
  }

  async function handleRetry() {
    if (!pendingEvent) {
      setPhase("ready");
      return;
    }

    await persistDecision(pendingEvent);
  }

  const isReady = phase === "ready" || phase === "submitting";
  const referenceCode = session?.participantId.slice(-8).toUpperCase();

  return (
    <main style={{ display: "grid", gap: 28 }}>
      <section
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 24,
          alignItems: "stretch",
          padding: 28,
          borderRadius: 32,
          background:
            "linear-gradient(135deg, rgba(255, 255, 255, 0.92), rgba(245, 240, 233, 0.88))",
          border: "1px solid rgba(23, 33, 43, 0.08)",
          boxShadow: "0 20px 50px rgba(22, 30, 40, 0.08)",
        }}
      >
        <div
          style={{
            flex: "1 1 520px",
            display: "grid",
            gap: 14,
          }}
        >
          <span
            style={{
              display: "inline-flex",
              width: "fit-content",
              alignItems: "center",
              borderRadius: 999,
              background: "#17212b",
              color: "#ffffff",
              padding: "7px 12px",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Decision review study
          </span>
          <h1
            style={{
              margin: 0,
              fontSize: "clamp(2.6rem, 5vw, 4.4rem)",
              lineHeight: 0.95,
              letterSpacing: "-0.04em",
              color: "#17212b",
              maxWidth: 760,
            }}
          >
            Review the case and choose the action you would take.
          </h1>
          <p
            style={{
              margin: 0,
              maxWidth: 760,
              fontSize: 18,
              lineHeight: 1.75,
              color: "#32414f",
            }}
          >
            You will see one short workplace scenario and one AI recommendation. Read both, then
            select the response that best matches your own judgment. There are no right or wrong
            answers.
          </p>
        </div>

        <div
          style={{
            flex: "0 1 280px",
            display: "grid",
            gap: 12,
            alignContent: "start",
          }}
        >
          <StudyPill label="Estimated time" value="Under 2 minutes" />
          <StudyPill label="Cases" value="1 of 1" />
          <StudyPill label="Current assistant" value={condition?.assistantName ?? "Preparing"} />
        </div>
      </section>

      <section
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 24,
          alignItems: "flex-start",
        }}
      >
        <aside
          style={{
            flex: "0 1 290px",
            display: "grid",
            gap: 18,
          }}
        >
          <section
            style={{
              padding: 22,
              borderRadius: 28,
              background: "rgba(255, 255, 255, 0.86)",
              border: "1px solid rgba(23, 33, 43, 0.08)",
              boxShadow: "0 16px 36px rgba(22, 30, 40, 0.05)",
            }}
          >
            <span
              style={{
                display: "block",
                marginBottom: 12,
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#5a6570",
              }}
            >
              Study brief
            </span>
            <div style={{ display: "grid", gap: 14 }}>
              <BriefRow
                title="One short case"
                copy="You will make a single decision after reviewing the scenario and the assistant recommendation."
              />
              <BriefRow
                title="Your judgment matters"
                copy="The assistant can help, but the final choice should reflect what you would personally do."
              />
              <BriefRow
                title="Submit once"
                copy="Your selection is recorded immediately when you choose an option."
              />
            </div>
          </section>

          <section
            style={{
              padding: 20,
              borderRadius: 24,
              background: "#17303d",
              color: "#ffffff",
              boxShadow: "0 18px 40px rgba(18, 30, 40, 0.14)",
            }}
          >
            <span
              style={{
                display: "block",
                marginBottom: 8,
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "rgba(255, 255, 255, 0.72)",
              }}
            >
              Session reference
            </span>
            <strong
              style={{
                display: "block",
                fontSize: 28,
                letterSpacing: "0.06em",
                marginBottom: 8,
              }}
            >
              {referenceCode ?? "--------"}
            </strong>
            <span
              style={{
                display: "block",
                fontSize: 14,
                lineHeight: 1.6,
                color: "rgba(255, 255, 255, 0.72)",
              }}
            >
              Use this code only if a facilitator asks you to confirm that your session was
              recorded.
            </span>
          </section>
        </aside>

        <div
          style={{
            flex: "1 1 680px",
            display: "grid",
            gap: 18,
          }}
        >
          {phase === "loading" ? (
            <section
              style={{
                padding: 26,
                borderRadius: 24,
                background: "#fff8e8",
                border: "1px solid rgba(23, 33, 43, 0.08)",
              }}
            >
              Preparing your study session.
            </section>
          ) : null}

          {isReady && condition && task ? (
            <>
              <ConditionBanner condition={condition} />
              <DecisionTask
                condition={condition}
                task={task}
                disabled={phase === "submitting"}
                onSubmit={handleDecision}
              />
            </>
          ) : null}

          {phase === "submitting" ? <SubmissionState phase="submitting" /> : null}

          {phase === "success" && session ? (
            <SubmissionState phase="success" participantId={session.participantId} />
          ) : null}

          {phase === "error" ? (
            <SubmissionState
              phase="error"
              errorMessage={submissionError ?? undefined}
              onRetry={pendingEvent ? handleRetry : undefined}
            />
          ) : null}
        </div>
      </section>
    </main>
  );
}

function StudyPill({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        padding: "14px 16px",
        borderRadius: 22,
        background: "rgba(255, 255, 255, 0.78)",
        border: "1px solid rgba(23, 33, 43, 0.08)",
        boxShadow: "0 12px 28px rgba(22, 30, 40, 0.05)",
      }}
    >
      <span
        style={{
          display: "block",
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "#5a6570",
          marginBottom: 4,
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: 16,
          fontWeight: 600,
          color: "#17212b",
        }}
      >
        {value}
      </span>
    </div>
  );
}

function BriefRow({ title, copy }: { title: string; copy: string }) {
  return (
    <div style={{ display: "grid", gap: 5 }}>
      <strong
        style={{
          fontSize: 16,
          color: "#17212b",
        }}
      >
        {title}
      </strong>
      <span
        style={{
          fontSize: 14,
          lineHeight: 1.6,
          color: "#5a6570",
        }}
      >
        {copy}
      </span>
    </div>
  );
}
