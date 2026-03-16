interface SubmissionStateProps {
  phase: "submitting" | "success" | "error";
  participantId?: string;
  errorMessage?: string;
  onRetry?: () => void;
}

export function SubmissionState({
  phase,
  participantId,
  errorMessage,
  onRetry,
}: SubmissionStateProps) {
  if (phase === "submitting") {
    return (
      <section
        aria-live="polite"
        style={{
          padding: 20,
          borderRadius: 18,
          background: "#fff8e8",
          border: "1px solid rgba(173, 117, 0, 0.18)",
        }}
      >
        <strong style={{ display: "block", marginBottom: 8, fontSize: 18 }}>
          Submitting your response
        </strong>
        <span style={{ color: "#5a6570", lineHeight: 1.6 }}>
          Please wait while your selection is recorded.
        </span>
      </section>
    );
  }

  if (phase === "success") {
    return (
      <section
        aria-live="polite"
        style={{
          padding: 24,
          borderRadius: 18,
          background: "#edf7f0",
          border: "1px solid rgba(28, 104, 55, 0.18)",
        }}
      >
        <strong style={{ display: "block", marginBottom: 8, fontSize: 20 }}>
          Thank you
        </strong>
        <p style={{ margin: 0, lineHeight: 1.6, color: "#39543e" }}>
          Your response has been recorded and this study session is complete.
        </p>
        {participantId ? (
          <p style={{ margin: "12px 0 0", color: "#39543e" }}>
            Reference code: {participantId.slice(-8).toUpperCase()}
          </p>
        ) : null}
      </section>
    );
  }

  return (
    <section
      aria-live="assertive"
      style={{
        padding: 24,
        borderRadius: 18,
        background: "#fff0ed",
        border: "1px solid rgba(161, 75, 43, 0.22)",
      }}
    >
      <strong style={{ display: "block", marginBottom: 8, fontSize: 20 }}>
        We could not save your response
      </strong>
      <p style={{ margin: 0, lineHeight: 1.6, color: "#703d2b" }}>
        {errorMessage ?? "Please retry to submit the same response again."}
      </p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          style={{
            marginTop: 16,
            border: "none",
            borderRadius: 999,
            padding: "12px 18px",
            background: "#703d2b",
            color: "#ffffff",
            fontSize: 14,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Try again
        </button>
      ) : null}
    </section>
  );
}
