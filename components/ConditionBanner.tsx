import type { ConditionConfig } from "@/lib/types";

interface ConditionBannerProps {
  condition: ConditionConfig;
}

export function ConditionBanner({ condition }: ConditionBannerProps) {
  return (
    <section
      aria-label="Assistant profile"
      style={{
        border: `1px solid ${condition.accentColor}30`,
        background: `linear-gradient(135deg, ${condition.surfaceColor}, rgba(255, 255, 255, 0.96))`,
        borderRadius: 28,
        padding: 24,
        boxShadow: "0 20px 50px rgba(22, 30, 40, 0.08)",
        display: "grid",
        gap: 18,
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div
            aria-hidden="true"
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              display: "grid",
              placeItems: "center",
              background: condition.accentColor,
              color: "#ffffff",
              fontSize: 24,
              fontWeight: 700,
              boxShadow: "0 12px 24px rgba(23, 33, 43, 0.16)",
            }}
          >
            {condition.assistantName.charAt(0)}
          </div>

          <div style={{ display: "grid", gap: 4 }}>
            <span
              style={{
                display: "inline-flex",
                width: "fit-content",
                alignItems: "center",
                borderRadius: 999,
                background: "#ffffff",
                color: condition.accentColor,
                padding: "6px 12px",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              AI assistant
            </span>
            <strong
              style={{
                fontSize: 28,
                lineHeight: 1.1,
                color: "#17212b",
              }}
            >
              {condition.assistantName}
            </strong>
            <span
              style={{
                fontSize: 15,
                fontWeight: 600,
                color: condition.accentColor,
              }}
            >
              {condition.roleLabel}
            </span>
          </div>
        </div>

        <div
          style={{
            minWidth: 180,
            padding: "12px 14px",
            borderRadius: 18,
            background: "rgba(255, 255, 255, 0.72)",
            border: `1px solid ${condition.accentColor}22`,
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
              marginBottom: 4,
            }}
          >
            This session
          </span>
          <span
            style={{
              fontSize: 15,
              color: "#17212b",
              lineHeight: 1.5,
            }}
          >
            One assistant, one case, one final decision.
          </span>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gap: 10,
          borderRadius: 22,
          padding: 18,
          background: "rgba(255, 255, 255, 0.78)",
          border: `1px solid ${condition.accentColor}18`,
        }}
      >
        <span
          style={{
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: condition.accentColor,
          }}
        >
          {condition.recommendationFraming}
        </span>
        <p
          style={{
            margin: 0,
            fontSize: 17,
            lineHeight: 1.65,
            color: "#24313d",
          }}
        >
          {condition.bannerText}
        </p>
        <p
          style={{
            margin: 0,
            fontSize: 15,
            lineHeight: 1.6,
            color: "#5a6570",
          }}
        >
          You can follow the assistant’s recommendation or choose a different action using your own
          judgment.
        </p>
      </div>
    </section>
  );
}
