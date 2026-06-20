export type JobStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
export type ProjectTag =
  | 'SUSTAINABILITY'
  | 'EDUCATION'
  | 'HEALTH'
  | 'TECHNOLOGY'
  | 'ENVIRONMENT'
  | 'COMMUNITY'
  | 'INNOVATION'
  | 'RURAL'
  | 'FOOD_SECURITY'
  | 'DIGITAL_INCLUSION'
  | 'WATER_ACCESS'
  | 'SOCIAL_IMPACT';

// Record<ProjectTag, ...> asegura que no te olvides de ningún tag
export const PROJECT_TAGS: Record<ProjectTag, { label: string; emoji: string }> = {
  SUSTAINABILITY: { label: 'Sustentabilidad', emoji: '🌱' },
  EDUCATION: { label: 'Educación', emoji: '📚' },
  HEALTH: { label: 'Salud', emoji: '🏥' },
  TECHNOLOGY: { label: 'Tecnología', emoji: '💻' },
  ENVIRONMENT: { label: 'Medio Ambiente', emoji: '🌎' },
  COMMUNITY: { label: 'Comunidad', emoji: '🤝' },
  INNOVATION: { label: 'Innovación', emoji: '🚀' },
  RURAL: { label: 'Desarrollo Rural', emoji: '🌾' },
  FOOD_SECURITY: { label: 'Seguridad Alimentaria', emoji: '🥬' },
  DIGITAL_INCLUSION: { label: 'Inclusión Digital', emoji: '📶' },
  WATER_ACCESS: { label: 'Acceso a Agua', emoji: '💧' },
  SOCIAL_IMPACT: { label: 'Impacto Social', emoji: '⭐' },
};

export interface Job {
  jobId: string;
  fileName: string;
  createdAt: string;
  status: JobStatus;
  processedCount?: number;
  totalCount?: number;
}

export interface ProjectEvaluation {
  projectName: string;
  tags: ProjectTag[];
  status: string;
  socialImpact: number;
  technicalFeasibility: number;
  economicFeasibility: number;
  riskLevel: 'Bajo' | 'Medio' | 'Alto';
  executiveSummary: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

export interface JobResults {
  jobId: string;
  fileName: string;
  status: JobStatus;
  projects: ProjectEvaluation[];
  processedAt?: string;
}

export interface UploadResponse {
  jobId: string;
  message: string;
}

export interface StatusResponse {
  jobId: string;
  status: JobStatus;
  processedCount: number;
  totalCount: number;
  message?: string;
}
