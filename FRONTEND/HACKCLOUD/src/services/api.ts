const API_URL =
  "https://bhyinl0grh.execute-api.us-east-1.amazonaws.com/results";

export async function getResults(uploadId: string) {
  const response = await fetch(
    `${API_URL}?uploadId=${uploadId}`
  );

  if (!response.ok) {
    throw new Error("Error obteniendo resultados");
  }

  return await response.json();
}
