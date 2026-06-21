const BASE_URL = "https://bhyinl0grh.execute-api.us-east-1.amazonaws.com";

// ─── TIPOS ────────────────────────────────────────────────────────────────────
export interface UploadResponse {
  jobId: string; // mapeo de UploadId
}

export interface StatusResponse {
  jobId: string;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
  processedCount: number;
  totalCount: number;
}

// ─── UPLOAD ───────────────────────────────────────────────────────────────────
// La Lambda genera una PresignedUrl → el frontend sube directo a S3
export async function uploadCSV(file: File): Promise<UploadResponse> {
  // Paso 1: pedir la URL prefirmada
  const res = await fetch(`${BASE_URL}/upload`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) throw new Error("Error al solicitar URL de subida");

  const raw = await res.json();
  // La Lambda puede devolver el body como string anidado
  const body = typeof raw.body === "string" ? JSON.parse(raw.body) : raw;
  const { UploadId, PresignedUrl } = body;

  // Paso 2: subir el CSV directo a S3 con la URL prefirmada
  const s3Res = await fetch(PresignedUrl, {
    method: "PUT",
    headers: { "Content-Type": "text/csv" },
    body: file,
  });

  if (!s3Res.ok) throw new Error("Error al subir el archivo a S3");

  return { jobId: UploadId };
}

// ─── STATUS ───────────────────────────────────────────────────────────────────
// No tienes Lambda de status → hacemos polling a /results
// Si hay datos = COMPLETED, si no = PROCESSING
export async function getStatus(jobId: string): Promise<StatusResponse> {
  const res = await fetch(`${BASE_URL}/results?uploadId=${jobId}`);

  if (!res.ok) throw new Error("Error obteniendo estado");

  const raw = await res.json();
  const items: unknown[] = Array.isArray(raw) ? raw : [];

  if (items.length > 0) {
    return {
      jobId,
      status: "COMPLETED",
      processedCount: items.length,
      totalCount: items.length,
    };
  }

  // Aún sin resultados = todavía procesando
  return {
    jobId,
    status: "PROCESSING",
    processedCount: 0,
    totalCount: 1, // evita división por 0 en la barra de progreso
  };
}

// ─── RESULTADOS ───────────────────────────────────────────────────────────────
export async function getResults(uploadId: string) {
  const res = await fetch(`${BASE_URL}/results?uploadId=${uploadId}`);

  if (!res.ok) throw new Error("Error obteniendo resultados");

  const raw = await res.json();
  // La Lambda puede devolver el body como string anidado
  const items = typeof raw.body === "string" ? JSON.parse(raw.body) : raw;

  // Mapear campos de DynamoDB → tipos del frontend
  return items.map((p: any) => ({
    projectName: p.ProjectName ?? "Sin nombre",
    tags: ["SOCIAL_IMPACT"],
    status: p.Status ?? "Evaluado",
    socialImpact: Number(p.ImpactScore ?? 0),
    technicalFeasibility: Number(p.TechnicalScore ?? 0),
    economicFeasibility: Number(p.EconomicScore ?? 0),
    riskLevel: p.Risk ?? "Medio",
    executiveSummary: p.Summary ?? "",
    strengths: Array.isArray(p.Fortalezas) ? p.Fortalezas : [],
    weaknesses: Array.isArray(p.Debilidades) ? p.Debilidades : [],
    recommendations: Array.isArray(p.Recomendaciones) ? p.Recomendaciones : [],
  }));
}