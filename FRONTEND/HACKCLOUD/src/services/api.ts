const BASE_URL =
  "https://bhyinl0grh.execute-api.us-east-1.amazonaws.com";

// SUBIR ARCHIVO
export async function uploadCSV(file: File) {
  const text = await file.text();

  const response = await fetch(`${BASE_URL}/upload`, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain",
    },
    body: text,
  });

  if (!response.ok) {
    throw new Error("Error subiendo archivo");
  }

  const data = await response.json();

  return typeof data.body === "string"
    ? JSON.parse(data.body)
    : data;
}

// OBTENER RESULTADOS
export async function getResults(uploadId: string) {
  const response = await fetch(
    `${BASE_URL}/results?uploadId=${uploadId}`
  );

  if (!response.ok) {
    throw new Error("Error obteniendo resultados");
  }

  return await response.json();
}

// OBTENER ESTADO
export async function getStatus(jobId: string) {
  const response = await fetch(
    `${BASE_URL}/status?jobId=${jobId}`
  );

  if (!response.ok) {
    throw new Error("Error obteniendo estado");
  }

  return await response.json();
}
