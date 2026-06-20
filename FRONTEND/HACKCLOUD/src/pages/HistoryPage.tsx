import React, { useEffect, useState } from "react";
import { mockGetJobs } from "../types/mock";
import type { Job } from "../types";
import { Badge } from "../components/Badge";
import { Spinner } from "../components/Spinner";
import { Clock, FileText, ExternalLink } from "lucide-react";

interface HistoryPageProps {
  onSelectJob: (jobId: string) => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({ onSelectJob }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    mockGetJobs()
      .then(setJobs)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const fmt = (iso: string) =>
    new Date(iso).toLocaleDateString("es-PE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  if (loading)
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 300,
          gap: 12,
        }}
      >
        <Spinner />{" "}
        <span style={{ color: "var(--text-secondary)" }}>
          Cargando historial…
        </span>
      </div>
    );

  if (error)
    return (
      <div style={{ padding: 32, textAlign: "center", color: "#ef4444" }}>
        Error: {error}
      </div>
    );

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "32px 24px" }}>
      <div className="fade-in" style={{ marginBottom: 28 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 6,
          }}
        >
          <Clock size={18} style={{ color: "var(--accent-teal)" }} />
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 22,
              color: "var(--text-primary)",
            }}
          >
            Historial de procesamientos
          </h1>
        </div>
        <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>
          {jobs.length} trabajos registrados
        </p>
      </div>

      {/* Table */}
      <div
        className="fade-in-2"
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 2fr 1.2fr 1fr auto",
            gap: 16,
            padding: "12px 20px",
            borderBottom: "1px solid var(--border)",
            background: "rgba(255,255,255,0.02)",
          }}
        >
          {["Job ID", "Archivo", "Fecha", "Estado", ""].map((h) => (
            <span
              key={h}
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: "var(--text-muted)",
                fontFamily: "var(--font-display)",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              {h}
            </span>
          ))}
        </div>

        {/* Rows */}
        {jobs.map((job, i) => (
          <div
            key={job.jobId}
            className="fade-in"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 2fr 1.2fr 1fr auto",
              gap: 16,
              padding: "14px 20px",
              borderBottom:
                i < jobs.length - 1 ? "1px solid var(--border)" : "none",
              alignItems: "center",
              animationDelay: `${i * 0.05}s`,
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "rgba(255,255,255,0.02)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
          >
            <span
              style={{
                fontSize: 11,
                fontFamily: "monospace",
                color: "var(--text-muted)",
              }}
            >
              {job.jobId}
            </span>

            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <FileText
                size={14}
                style={{ color: "var(--text-muted)", flexShrink: 0 }}
              />
              <span
                style={{
                  fontSize: 13,
                  color: "var(--text-primary)",
                  fontWeight: 500,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {job.fileName}
              </span>
            </div>

            <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>
              {fmt(job.createdAt)}
            </span>

            <Badge status={job.status} />

            {job.status === "COMPLETED" && (
              <button
                onClick={() => onSelectJob(job.jobId)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "5px 12px",
                  borderRadius: "var(--radius-sm)",
                  background: "var(--accent-teal-dim)",
                  border: "1px solid rgba(0,212,177,0.2)",
                  color: "var(--accent-teal)",
                  fontSize: 12,
                  cursor: "pointer",
                  fontFamily: "var(--font-display)",
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                }}
              >
                <ExternalLink size={11} /> Ver
              </button>
            )}
            {job.status !== "COMPLETED" && (
              <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                {job.processedCount ?? 0}/{job.totalCount ?? "?"}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
