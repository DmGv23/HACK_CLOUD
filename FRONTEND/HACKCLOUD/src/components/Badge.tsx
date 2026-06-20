import React from "react";
import type { JobStatus } from "../types";

interface BadgeProps {
  status: JobStatus | string;
  size?: "sm" | "md";
}

const config: Record<string, { label: string; color: string; bg: string }> = {
  PENDING: {
    label: "Pendiente",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.12)",
  },
  PROCESSING: {
    label: "Procesando",
    color: "#60a5fa",
    bg: "rgba(96,165,250,0.12)",
  },
  COMPLETED: {
    label: "Completado",
    color: "#00d4b1",
    bg: "rgba(0,212,177,0.12)",
  },
  FAILED: { label: "Error", color: "#ef4444", bg: "rgba(239,68,68,0.12)" },
};

export const Badge: React.FC<BadgeProps> = ({ status, size = "sm" }) => {
  const cfg = config[status] ?? {
    label: status,
    color: "#8a9bc2",
    bg: "rgba(138,155,194,0.12)",
  };
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: size === "md" ? "5px 12px" : "3px 8px",
        borderRadius: 999,
        fontSize: size === "md" ? 13 : 11,
        fontWeight: 600,
        fontFamily: "var(--font-display)",
        color: cfg.color,
        background: cfg.bg,
        border: `1px solid ${cfg.color}33`,
        letterSpacing: "0.02em",
        whiteSpace: "nowrap",
      }}
    >
      {status === "PROCESSING" && (
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: cfg.color,
            display: "inline-block",
            animation: "pulse-ring 1.2s ease infinite",
          }}
        />
      )}
      {cfg.label}
    </span>
  );
};
