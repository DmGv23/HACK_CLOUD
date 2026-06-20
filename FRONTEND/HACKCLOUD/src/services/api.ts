const BASE_URL =
  "https://bhyinl0grh.execute-api.us-east-1.amazonaws.com";

export async function uploadCSV(file: File) {
  const text = await file.text();

  const response = await fetch(
    `${BASE_URL}/upload`,
    {
      method: "POST",
      headers: {
        "Content-Type": "text/plain",
      },
      body: text,
    }
  );

  if (!response.ok) {
    throw new Error("Error al subir archivo");
  }

  return await response.json();
}

export async function getResults(uploadId: string) {
  const response = await fetch(
    `${BASE_URL}/results?uploadId=${uploadId}`
  );

  if (!response.ok) {
    throw new Error("Error obteniendo resultados");
  }

  return await response.json();
}
