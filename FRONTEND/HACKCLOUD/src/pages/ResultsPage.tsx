import React, { useEffect, useState } from "react";
import { getResults } from "../services/api";
import type { JobResults } from "../types";
import { ProjectCard } from "../components/ProjectCard";
import { Spinner } from "../components/Spinner";
import { BarChart3, TrendingUp, Zap, DollarSign, Shield } from "lucide-react";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";

interface ResultsPageProps {
  jobId: string;
}

export const ResultsPage: React.FC<ResultsPageProps> = ({ jobId }) => {
  const [data, setData] = useState<JobResults | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
  getResults(jobId)
    .then((projects) => {
      setData({
        jobId,
        fileName: "proyectos.json",
        status: "COMPLETED",
        projects: projects.map((p: any) => ({
          projectName: p.ProjectName,
          tags: ["SOCIAL_IMPACT"],
          status: p.Status,
          socialImpact: p.ImpactScore,
          technicalFeasibility: p.TechnicalScore,
          economicFeasibility: p.EconomicScore,
          riskLevel: p.Risk,
          executiveSummary: p.Summary,
          strengths: [],
          weaknesses: [],
          recommendations: [],
        })),
      });
    })
    .catch((e) => setError(e.message))
    .finally(() => setLoading(false));
}, [jobId]);

  if (loading)
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 400,
          gap: 16,
        }}
      >
        <Spinner size={36} />
        <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>
          Cargando resultados…
        </p>
      </div>
    );

  if (error)
    return (
      <div style={{ padding: 32, textAlign: "center", color: "#ef4444" }}>
        Error al cargar resultados: {error}
      </div>
    );

  if (!data) return null;

  const projects = data.projects;
  const avgSocial = (
    projects.reduce((s, p) => s + p.socialImpact, 0) / projects.length
  ).toFixed(1);
  const avgTech = (
    projects.reduce((s, p) => s + p.technicalFeasibility, 0) / projects.length
  ).toFixed(1);
  const avgEcon = (
    projects.reduce((s, p) => s + p.economicFeasibility, 0) / projects.length
  ).toFixed(1);
  const riskCounts = {
    Bajo: projects.filter((p) => p.riskLevel === "Bajo").length,
    Medio: projects.filter((p) => p.riskLevel === "Medio").length,
    Alto: projects.filter((p) => p.riskLevel === "Alto").length,
  };

  const radarData = [
    { subject: "Impacto Social", A: parseFloat(avgSocial) },
    { subject: "Viab. Técnica", A: parseFloat(avgTech) },
    { subject: "Viab. Económica", A: parseFloat(avgEcon) },
  ];

  const barData = [
    { name: "Bajo", value: riskCounts.Bajo, color: "#00d4b1" },
    { name: "Medio", value: riskCounts.Medio, color: "#f59e0b" },
    { name: "Alto", value: riskCounts.Alto, color: "#ef4444" },
  ];

  const statCards = [
    {
      label: "Proyectos evaluados",
      value: projects.length,
      icon: <BarChart3 size={18} />,
      color: "var(--accent-teal)",
    },
    {
      label: "Impacto Social promedio",
      value: avgSocial,
      icon: <TrendingUp size={18} />,
      color: "#60a5fa",
      suffix: "/10",
    },
    {
      label: "Viabilidad Técnica prom.",
      value: avgTech,
      icon: <Zap size={18} />,
      color: "var(--accent-purple)",
      suffix: "/10",
    },
    {
      label: "Viabilidad Económica prom.",
      value: avgEcon,
      icon: <DollarSign size={18} />,
      color: "#f59e0b",
      suffix: "/10",
    },
  ];

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px" }}>
      {/* Header */}
      <div className="fade-in" style={{ marginBottom: 32 }}>
        <div
          style={{
            fontSize: 11,
            color: "var(--text-muted)",
            fontFamily: "var(--font-display)",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            marginBottom: 6,
          }}
        >
          Job ID: {jobId}
        </div>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: 26,
            color: "var(--text-primary)",
            marginBottom: 4,
          }}
        >
          Dashboard de Resultados
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>
          {data.fileName} · {projects.length} proyectos analizados
        </p>
      </div>

      {/* Stat cards */}
      <div
        className="fade-in-2"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 14,
          marginBottom: 28,
        }}
      >
        {statCards.map((s, i) => (
          <div
            key={i}
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-md)",
              padding: "16px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 10,
              }}
            >
              <span style={{ color: s.color }}>{s.icon}</span>
              <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
                {s.label}
              </span>
            </div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 26,
                color: s.color,
                lineHeight: 1,
              }}
            >
              {s.value}
              {s.suffix && (
                <span
                  style={{
                    fontSize: 12,
                    color: "var(--text-muted)",
                    fontWeight: 400,
                  }}
                >
                  {s.suffix}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div
        className="fade-in-3"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
          marginBottom: 32,
        }}
      >
        {/* Radar */}
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-lg)",
            padding: 20,
          }}
        >
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              fontSize: 14,
              color: "var(--text-secondary)",
              marginBottom: 16,
            }}
          >
            Perfil promedio
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#1e2d45" />
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fill: "#8a9bc2", fontSize: 11 }}
              />
              <Radar
                name="Score"
                dataKey="A"
                stroke="#00d4b1"
                fill="#00d4b1"
                fillOpacity={0.15}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Risk bars */}
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-lg)",
            padding: 20,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              marginBottom: 16,
            }}
          >
            <Shield size={14} style={{ color: "var(--text-muted)" }} />
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                fontSize: 14,
                color: "var(--text-secondary)",
              }}
            >
              Distribución de riesgo
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={barData} barCategoryGap="35%">
              <XAxis
                dataKey="name"
                tick={{ fill: "#8a9bc2", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#4a5a7a", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: "#0f1829",
                  border: "1px solid #1e2d45",
                  borderRadius: 8,
                  fontSize: 12,
                }}
                labelStyle={{ color: "#f0f4ff" }}
                cursor={{ fill: "rgba(255,255,255,0.03)" }}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {barData.map((d, i) => (
                  <Cell key={i} fill={d.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Risk summary pills */}
      <div
        style={{ display: "flex", gap: 12, marginBottom: 28, flexWrap: "wrap" }}
      >
        {[
          {
            label: "Riesgo Bajo",
            count: riskCounts.Bajo,
            color: "#00d4b1",
            bg: "rgba(0,212,177,0.08)",
          },
          {
            label: "Riesgo Medio",
            count: riskCounts.Medio,
            color: "#f59e0b",
            bg: "rgba(245,158,11,0.08)",
          },
          {
            label: "Riesgo Alto",
            count: riskCounts.Alto,
            color: "#ef4444",
            bg: "rgba(239,68,68,0.08)",
          },
        ].map((r) => (
          <div
            key={r.label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 16px",
              borderRadius: "var(--radius-md)",
              background: r.bg,
              border: `1px solid ${r.color}22`,
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 22,
                color: r.color,
              }}
            >
              {r.count}
            </span>
            <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>
              {r.label}
            </span>
          </div>
        ))}
      </div>

      {/* Project cards */}
      <h2
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 600,
          fontSize: 18,
          color: "var(--text-primary)",
          marginBottom: 16,
        }}
      >
        Proyectos evaluados
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {projects.map((p, i) => (
          <ProjectCard key={i} project={p} index={i} />
        ))}
      </div>
    </div>
  );
};
