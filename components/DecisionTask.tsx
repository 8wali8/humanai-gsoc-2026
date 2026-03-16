"use client";

import { useEffect, useRef } from "react";

import type { ConditionConfig, Decision, TaskConfig } from "@/lib/types";

interface DecisionTaskProps {
  condition: ConditionConfig;
  task: TaskConfig;
  disabled?: boolean;
  onSubmit: (decision: Decision, latencyMs: number) => void;
}

export function DecisionTask({
  condition,
  task,
  disabled = false,
  onSubmit,
}: DecisionTaskProps) {
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (!disabled) {
      startTimeRef.current = performance.now();
    }
  }, [condition.id, disabled, task.id]);

  function handleDecision(decision: Decision) {
    if (disabled) {
      return;
    }

    const startedAt = startTimeRef.current ?? performance.now();
    const latencyMs = Math.max(0, Math.round(performance.now() - startedAt));

    onSubmit(decision, latencyMs);
  }

  return (
    <section
      style={{
        background: "rgba(255, 253, 248, 0.96)",
        border: "1px solid rgba(23, 33, 43, 0.08)",
        borderRadius: 30,
        padding: 30,
        boxShadow: "0 22px 48px rgba(22, 30, 40, 0.1)",
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        <div style={{ display: "grid", gap: 12 }}>
          <span
            style={{
              display: "inline-flex",
              width: "fit-content",
              alignItems: "center",
              borderRadius: 999,
              background: "#eef2f3",
              color: "#405364",
              padding: "7px 12px",
              fontSize: 12,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              fontWeight: 700,
            }}
          >
            Case 01
          </span>
          <h2
            style={{
              margin: 0,
              fontSize: 34,
              lineHeight: 1.08,
              color: "#17212b",
            }}
          >
            {task.title}
          </h2>
        </div>

        <div
          style={{
            minWidth: 190,
            padding: "14px 16px",
            borderRadius: 20,
            background: "#f3efe7",
            border: "1px solid rgba(23, 33, 43, 0.08)",
          }}
        >
          <span
            style={{
              display: "block",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#5a6570",
              marginBottom: 6,
            }}
          >
            Response guidance
          </span>
          <span
            style={{
              display: "block",
              fontSize: 15,
              lineHeight: 1.55,
              color: "#24313d",
            }}
          >
            Choose the action you would actually take after reviewing the case.
          </span>
        </div>
      </div>

      <div
        style={{
          marginTop: 24,
          padding: 22,
          borderRadius: 24,
          background: "#ffffff",
          border: "1px solid rgba(23, 33, 43, 0.08)",
          display: "grid",
          gap: 12,
        }}
      >
        <span
          style={{
            color: "#5a6570",
            fontSize: 12,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            fontWeight: 700,
          }}
        >
          Case materials
        </span>
        <p
          style={{
            margin: 0,
            fontSize: 17,
            lineHeight: 1.75,
            color: "#24313d",
          }}
        >
          {task.scenario}
        </p>
      </div>

      <div
        style={{
          marginTop: 22,
          padding: 22,
          borderRadius: 24,
          border: `1px solid ${condition.accentColor}30`,
          background: "#ffffff",
          display: "grid",
          gap: 10,
        }}
      >
        <span
          style={{
            fontSize: 12,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: condition.accentColor,
          }}
        >
          AI recommendation
        </span>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: 8,
          }}
        >
          <strong
            style={{
              fontSize: 20,
              color: "#17212b",
            }}
          >
            {condition.assistantName}
          </strong>
          <span
            style={{
              fontSize: 14,
              color: "#5a6570",
            }}
          >
            {condition.recommendationFraming}
          </span>
        </div>
        <strong
          style={{
            fontSize: 28,
            lineHeight: 1.2,
            color: "#17212b",
          }}
        >
          {task.recommendationText}
        </strong>
      </div>

      <div style={{ marginTop: 28, display: "grid", gap: 18 }}>
        <p
          style={{
            margin: 0,
            fontSize: 18,
            lineHeight: 1.5,
          }}
        >
          {task.decisionPrompt}
        </p>

        <div
          style={{
            display: "grid",
            gap: 12,
          }}
        >
          <ActionButton
            disabled={disabled}
            emphasis="primary"
            label={task.acceptLabel}
            detail="Use the assistant's suggested action."
            onClick={() => handleDecision("accept")}
          />
          <ActionButton
            disabled={disabled}
            emphasis="secondary"
            label={task.overrideLabel}
            detail="Reject the suggestion and make a different decision."
            onClick={() => handleDecision("override")}
          />
        </div>

        <p
          style={{
            margin: 0,
            fontSize: 14,
            lineHeight: 1.6,
            color: "#5a6570",
          }}
        >
          Once you select an option, your response is submitted immediately. You may take as much
          time as you need before choosing.
        </p>
      </div>
    </section>
  );
}

function ActionButton({
  disabled,
  emphasis,
  label,
  detail,
  onClick,
}: {
  disabled: boolean;
  emphasis: "primary" | "secondary";
  label: string;
  detail: string;
  onClick: () => void;
}) {
  const isPrimary = emphasis === "primary";

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      style={{
        cursor: disabled ? "wait" : "pointer",
        display: "grid",
        gap: 6,
        textAlign: "left",
        width: "100%",
        padding: "18px 20px",
        borderRadius: 20,
        border: isPrimary ? "none" : "1px solid rgba(23, 33, 43, 0.16)",
        background: isPrimary ? "#17212b" : "#ffffff",
        color: isPrimary ? "#ffffff" : "#17212b",
        opacity: disabled ? 0.7 : 1,
        boxShadow: isPrimary ? "0 14px 28px rgba(23, 33, 43, 0.16)" : "none",
      }}
    >
      <span
        style={{
          fontSize: 16,
          fontWeight: 700,
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: 14,
          lineHeight: 1.5,
          color: isPrimary ? "rgba(255, 255, 255, 0.78)" : "#5a6570",
        }}
      >
        {detail}
      </span>
    </button>
  );
}
