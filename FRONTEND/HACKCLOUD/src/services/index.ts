import axios from 'axios';
import type { Job, JobResults, StatusResponse, UploadResponse } from '../types';

const BASE_URL = import.meta.env.VITE_API_URL || 'https://api.impactia.example.com';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (!err.response) {
      throw new Error('Backend no disponible. Verifica tu conexión.');
    }
    const msg = err.response?.data?.message || 'Error en el servidor.';
    throw new Error(msg);
  }
);

export async function uploadCSV(file: File): Promise<UploadResponse> {
  const form = new FormData();
  form.append('file', file);
  const { data } = await api.post<UploadResponse>('/upload', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export async function getStatus(jobId: string): Promise<StatusResponse> {
  const { data } = await api.get<StatusResponse>(`/status/${jobId}`);
  return data;
}

export async function getResults(jobId: string): Promise<JobResults> {
  const { data } = await api.get<JobResults>(`/results/${jobId}`);
  return data;
}

export async function getJobs(): Promise<Job[]> {
  const { data } = await api.get<Job[]>('/jobs');
  return data;
}
