import React, { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import type { ProjectEvaluation } from "../types";
import { PROJECT_TAGS } from "../types"; // Importamos la constante de etiquetas
import { ScoreBar } from "./ScoreBar";

interface ProjectCardProps {
  project: ProjectEvaluation;
  index: number;
}

const riskConfig = {
  Bajo: {
    color: "var(--risk-low)",
    icon: <CheckCircle size={13} />,
    bg: "rgba(0,212,177,0.1)",
  },
  Medio: {
    color: "var(--risk-mid)",
    icon: <AlertTriangle size={13} />,
    bg: "rgba(245,158,11,0.1)",
  },
  Alto: {
    color: "var(--risk-high)",
    icon: <XCircle size={13} />,
    bg: "rgba(239,68,68,0.1)",
  },
};

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, index }) => {
  const [expanded, setExpanded] = useState(false);
  const risk = riskConfig[project.riskLevel] ?? riskConfig["Medio"];
  const avgScore = (
    (project.socialImpact +
      project.technicalFeasibility +
      project.economicFeasibility) /
    3
  ).toFixed(1);

  return (
    <div
      className="fade-in"
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
        transition: "border-color 0.2s, box-shadow 0.2s",
        animationDelay: `${index * 0.05}s`,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor =
          "rgba(0,212,177,0.3)";
        (e.currentTarget as HTMLElement).style.boxShadow =
          "0 4px 24px rgba(0,212,177,0.08)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
        (e.currentTarget as HTMLElement).style.boxShadow = "none";
      }}
    >
      {/* Header */}
      <div style={{ padding: "18px 20px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 12,
            marginBottom: 16,
          }}
        >
          <div>
            {/* Contenedor Flex para el número de proyecto y sus Tags */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                flexWrap: "wrap",
                marginBottom: 6,
              }}
            >
              <span
                style={{
                  fontSize: 10,
                  color: "var(--text-muted)",
                  fontFamily: "var(--font-display)",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                Proyecto #{index + 1}
              </span>

              {/* Mapeo dinámico de etiquetas inteligentes */}
              {project.tags?.map((tagKey) => {
                const tagInfo = PROJECT_TAGS[tagKey];
                if (!tagInfo) return null;
                return (
                  <span
                    key={tagKey}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                      backgroundColor: "rgba(255, 255, 255, 0.04)",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                      padding: "1px 6px",
                      borderRadius: 6,
                      fontSize: 10,
                      fontWeight: 500,
                      color: "var(--text-secondary)",
                    }}
                  >
                    <span>{tagInfo.emoji}</span>
                    <span>{tagInfo.label}</span>
                  </span>
                );
              })}
            </div>

            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 16,
                color: "var(--text-primary)",
                lineHeight: 1.2,
              }}
            >
              {project.projectName}
            </h3>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              flexShrink: 0,
            }}
          >
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                padding: "4px 10px",
                borderRadius: 999,
                background: risk.bg,
                color: risk.color,
                fontSize: 11,
                fontWeight: 600,
                fontFamily: "var(--font-display)",
                border: `1px solid ${risk.color}33`,
              }}
            >
              {risk.icon} {project.riskLevel}
            </span>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 10,
                background:
                  "linear-gradient(135deg, var(--accent-teal-dim), var(--accent-purple-dim))",
                border: "1px solid rgba(0,212,177,0.2)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: 16,
                  color: "var(--accent-teal)",
                  lineHeight: 1,
                }}
              >
                {avgScore}
              </span>
              <span
                style={{
                  fontSize: 8,
                  color: "var(--text-muted)",
                  marginTop: 1,
                }}
              >
                promedio
              </span>
            </div>
          </div>
        </div>

        {/* Scores */}
        <ScoreBar label="Impacto Social" value={project.socialImpact} />
        <ScoreBar
          label="Viabilidad Técnica"
          value={project.technicalFeasibility}
        />
        <ScoreBar
          label="Viabilidad Económica"
          value={project.economicFeasibility}
        />
      </div>

      {/* Summary - Se aumentó paddingTop de 14 a 18 para ganar "aire" */}
      <div style={{ padding: "0 20px 4px" }}>
        <p
          style={{
            fontSize: 13,
            color: "var(--text-secondary)",
            lineHeight: 1.6,
            borderTop: "1px solid var(--border)",
            paddingTop: 18,
          }}
        >
          {project.executiveSummary}
        </p>
      </div>

      {/* Expand toggle */}
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          width: "100%",
          padding: "12px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          background: "transparent",
          border: "none",
          borderTop: "1px solid var(--border)",
          color: "var(--text-muted)",
          fontSize: 12,
          cursor: "pointer",
          fontFamily: "var(--font-body)",
          transition: "color 0.15s",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.color = "var(--accent-teal)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.color = "var(--text-muted)")
        }
      >
        {expanded ? (
          <>
            <ChevronUp size={14} /> Ocultar análisis
          </>
        ) : (
          <>
            <ChevronDown size={14} /> Ver análisis completo
          </>
        )}
      </button>

      {/* Expanded content */}
      {expanded && (
        <div
          style={{
            padding: "0 20px 20px",
            borderTop: "1px solid var(--border)",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 12,
              paddingTop: 16,
            }}
          >
            {/* Fortalezas */}
            <div
              style={{
                background: "rgba(0,212,177,0.05)",
                borderRadius: "var(--radius-md)",
                padding: 14,
                border: "1px solid rgba(0,212,177,0.12)",
              }}
            >
              <h4
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "var(--risk-low)",
                  fontFamily: "var(--font-display)",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: 10,
                }}
              >
                Fortalezas
              </h4>
              <ul
                style={{
                  listStyle: "none",
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                }}
              >
                {project.strengths.map((s, i) => (
                  <li
                    key={i}
                    style={{
                      fontSize: 12,
                      color: "var(--text-secondary)",
                      display: "flex",
                      gap: 6,
                      lineHeight: 1.4,
                    }}
                  >
                    <span style={{ color: "var(--risk-low)", flexShrink: 0 }}>
                      +
                    </span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            {/* Debilidades */}
            <div
              style={{
                background: "rgba(239,68,68,0.05)",
                borderRadius: "var(--radius-md)",
                padding: 14,
                border: "1px solid rgba(239,68,68,0.12)",
              }}
            >
              <h4
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "var(--risk-high)",
                  fontFamily: "var(--font-display)",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: 10,
                }}
              >
                Debilidades
              </h4>
              <ul
                style={{
                  listStyle: "none",
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                }}
              >
                {project.weaknesses.map((w, i) => (
                  <li
                    key={i}
                    style={{
                      fontSize: 12,
                      color: "var(--text-secondary)",
                      display: "flex",
                      gap: 6,
                      lineHeight: 1.4,
                    }}
                  >
                    <span style={{ color: "var(--risk-high)", flexShrink: 0 }}>
                      −
                    </span>
                    {w}
                  </li>
                ))}
              </ul>
            </div>

            {/* Recomendaciones */}
            <div
              style={{
                background: "rgba(124,58,237,0.05)",
                borderRadius: "var(--radius-md)",
                padding: 14,
                border: "1px solid rgba(124,58,237,0.15)",
              }}
            >
              <h4
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "var(--accent-purple)",
                  fontFamily: "var(--font-display)",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: 10,
                }}
              >
                Recomendaciones
              </h4>
              <ul
                style={{
                  listStyle: "none",
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                }}
              >
                {project.recommendations.map((r, i) => (
                  <li
                    key={i}
                    style={{
                      fontSize: 12,
                      color: "var(--text-secondary)",
                      display: "flex",
                      gap: 6,
                      lineHeight: 1.4,
                    }}
                  >
                    <span
                      style={{ color: "var(--accent-purple)", flexShrink: 0 }}
                    >
                      →
                    </span>
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
