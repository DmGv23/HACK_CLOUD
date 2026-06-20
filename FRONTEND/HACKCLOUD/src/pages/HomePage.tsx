import React, { useRef, useState } from "react";
import {
  Upload,
  FileText,
  AlertCircle,
  CheckCircle2,
  Zap,
  Shield,
  TrendingUp,
} from "lucide-react";
import { uploadCSV } from "../services/api";
import { useJobStatus } from "../types/useJobStatus";
import { Spinner } from "../components/Spinner";

interface HomePageProps {
  onJobReady: (jobId: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onJobReady }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadOk, setUploadOk] = useState(false);
  const [jobId, setJobId] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const { status } = useJobStatus(jobId);

  const handleFile = (f: File | null) => {
    setFileError(null);
    setUploadError(null);
    setUploadOk(false);
    if (!f) return;
    if (!f.name.endsWith(".csv")) {
      setFileError("Solo se aceptan archivos .csv");
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      setFileError("El archivo no debe superar 10 MB");
      return;
    }
    setFile(f);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setUploadError(null);
    try {
      const result = await uploadCSV(file);
      console.log(result);
      
      setUploadOk(true);
      setJobId(res.jobId);
    } catch (e: unknown) {
      setUploadError(
        e instanceof Error ? e.message : "Error al subir el archivo",
      );
    } finally {
      setUploading(false);
    }
  };

  const pct = status
    ? Math.round((status.processedCount / status.totalCount) * 100)
    : 0;
  const isDone = status?.status === "COMPLETED";
  const isFailed = status?.status === "FAILED";

  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "40px 24px" }}>
      {/* Hero */}
      <div
        className="fade-in"
        style={{ textAlign: "center", marginBottom: 48 }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "5px 14px",
            borderRadius: 999,
            background: "var(--accent-teal-dim)",
            border: "1px solid rgba(0,212,177,0.2)",
            fontSize: 11,
            fontWeight: 600,
            color: "var(--accent-teal)",
            fontFamily: "var(--font-display)",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            marginBottom: 20,
          }}
        >
          <Zap size={11} />
          Potenciado por IA Generativa
        </div>

        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: "clamp(32px, 6vw, 52px)",
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
            marginBottom: 16,
            background:
              "linear-gradient(135deg, var(--text-primary) 40%, var(--accent-teal))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Impact
          <span style={{ WebkitTextFillColor: "var(--accent-teal)" }}>IA</span>
        </h1>

        <p
          style={{
            fontSize: 16,
            color: "var(--text-secondary)",
            lineHeight: 1.65,
            maxWidth: 480,
            margin: "0 auto",
          }}
        >
          Plataforma de evaluación inteligente de proyectos sociales mediante
          IA. Sube tu CSV y obtén análisis profundos en segundos.
        </p>
      </div>

      {/* Feature pills */}
      <div
        className="fade-in-2"
        style={{
          display: "flex",
          gap: 12,
          justifyContent: "center",
          flexWrap: "wrap",
          marginBottom: 40,
        }}
      >
        {[
          { icon: <TrendingUp size={13} />, text: "Impacto Social" },
          { icon: <Zap size={13} />, text: "Viabilidad Técnica" },
          { icon: <Shield size={13} />, text: "Análisis de Riesgo" },
        ].map((f) => (
          <span
            key={f.text}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 14px",
              borderRadius: 999,
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              fontSize: 12,
              color: "var(--text-secondary)",
            }}
          >
            <span style={{ color: "var(--accent-teal)" }}>{f.icon}</span>
            {f.text}
          </span>
        ))}
      </div>

      {/* Upload Card */}
      <div
        className="fade-in-3"
        style={{
          background: "var(--bg-card)",
          border: `1px solid var(--border)`,
          borderRadius: "var(--radius-xl)",
          padding: 32,
          boxShadow: "var(--shadow-card)",
        }}
      >
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 600,
            fontSize: 18,
            marginBottom: 24,
            color: "var(--text-primary)",
          }}
        >
          Subir proyectos para evaluar
        </h2>

        {/* Drop zone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          style={{
            border: `2px dashed ${dragOver ? "var(--accent-teal)" : fileError ? "#ef4444" : file ? "var(--accent-teal)" : "var(--border)"}`,
            borderRadius: "var(--radius-lg)",
            padding: "36px 24px",
            textAlign: "center",
            cursor: "pointer",
            transition: "all 0.2s",
            background: dragOver
              ? "var(--accent-teal-dim)"
              : file
                ? "rgba(0,212,177,0.04)"
                : "var(--bg-input)",
            marginBottom: 20,
          }}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".csv"
            style={{ display: "none" }}
            onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
          />
          {file ? (
            <div>
              <FileText
                size={32}
                style={{
                  color: "var(--accent-teal)",
                  marginBottom: 10,
                  margin: "0 auto 10px",
                }}
              />
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 600,
                  color: "var(--accent-teal)",
                  fontSize: 15,
                }}
              >
                {file.name}
              </p>
              <p
                style={{
                  fontSize: 12,
                  color: "var(--text-muted)",
                  marginTop: 4,
                }}
              >
                {(file.size / 1024).toFixed(1)} KB · Haz clic para cambiar
              </p>
            </div>
          ) : (
            <div>
              <Upload
                size={32}
                style={{ color: "var(--text-muted)", margin: "0 auto 12px" }}
              />
              <p
                style={{
                  color: "var(--text-secondary)",
                  fontSize: 14,
                  marginBottom: 4,
                }}
              >
                Arrastra tu archivo CSV aquí
              </p>
              <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
                o haz clic para seleccionar · máx. 10 MB
              </p>
            </div>
          )}
        </div>

        {/* Error */}
        {fileError && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 14px",
              borderRadius: "var(--radius-sm)",
              background: "rgba(239,68,68,0.08)",
              border: "1px solid rgba(239,68,68,0.2)",
              color: "#ef4444",
              fontSize: 13,
              marginBottom: 16,
            }}
          >
            <AlertCircle size={15} /> {fileError}
          </div>
        )}
        {uploadError && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 14px",
              borderRadius: "var(--radius-sm)",
              background: "rgba(239,68,68,0.08)",
              border: "1px solid rgba(239,68,68,0.2)",
              color: "#ef4444",
              fontSize: 13,
              marginBottom: 16,
            }}
          >
            <AlertCircle size={15} /> {uploadError}
          </div>
        )}
        {uploadOk && !isDone && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 14px",
              borderRadius: "var(--radius-sm)",
              background: "var(--accent-teal-dim)",
              border: "1px solid rgba(0,212,177,0.2)",
              color: "var(--accent-teal)",
              fontSize: 13,
              marginBottom: 16,
            }}
          >
            <CheckCircle2 size={15} /> Archivo recibido. Procesando proyectos…
          </div>
        )}

        {/* Progress */}
        {status && !isDone && !isFailed && (
          <div
            style={{
              padding: "16px",
              borderRadius: "var(--radius-md)",
              background: "var(--bg-input)",
              border: "1px solid var(--border)",
              marginBottom: 20,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 10,
              }}
            >
              <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                {status.processedCount} / {status.totalCount} proyectos
                evaluados
              </span>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "var(--accent-teal)",
                  fontFamily: "var(--font-display)",
                }}
              >
                {pct}%
              </span>
            </div>
            <div
              style={{
                height: 6,
                borderRadius: 3,
                background: "rgba(255,255,255,0.06)",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${pct}%`,
                  borderRadius: 3,
                  background:
                    "linear-gradient(90deg, var(--accent-purple), var(--accent-teal))",
                  transition: "width 0.6s ease",
                  boxShadow: "0 0 12px var(--accent-teal-glow)",
                }}
              />
            </div>
          </div>
        )}

        {/* Completed */}
        {isDone && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "14px 16px",
              borderRadius: "var(--radius-md)",
              background: "var(--accent-teal-dim)",
              border: "1px solid rgba(0,212,177,0.25)",
              marginBottom: 20,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <CheckCircle2 size={18} style={{ color: "var(--accent-teal)" }} />
              <span
                style={{
                  fontSize: 14,
                  color: "var(--accent-teal)",
                  fontWeight: 600,
                }}
              >
                ¡Evaluación completada! {status?.totalCount} proyectos
                procesados.
              </span>
            </div>
            <button
              onClick={() => onJobReady(jobId!)}
              style={{
                padding: "8px 18px",
                borderRadius: "var(--radius-sm)",
                background: "var(--accent-teal)",
                border: "none",
                color: "#000",
                fontWeight: 700,
                fontSize: 13,
                fontFamily: "var(--font-display)",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              Ver resultados →
            </button>
          </div>
        )}

        {/* Submit button */}
        {!uploadOk && (
          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "var(--radius-md)",
              border: "none",
              background:
                file && !uploading
                  ? "linear-gradient(135deg, var(--accent-teal), #00b89a)"
                  : "var(--border)",
              color: file && !uploading ? "#000" : "var(--text-muted)",
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 15,
              cursor: file && !uploading ? "pointer" : "not-allowed",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              transition: "all 0.2s",
              boxShadow:
                file && !uploading
                  ? "0 4px 20px var(--accent-teal-glow)"
                  : "none",
            }}
          >
            {uploading ? (
              <>
                <Spinner size={18} color="#000" /> Enviando…
              </>
            ) : (
              "Procesar Proyectos"
            )}
          </button>
        )}
      </div>
    </div>
  );
};
