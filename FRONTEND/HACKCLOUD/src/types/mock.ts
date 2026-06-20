import type { Job, JobResults, StatusResponse, UploadResponse } from '../types';

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function mockUploadCSV(_file: File): Promise<UploadResponse> {
  await delay(1200);
  return { jobId: `job-${Date.now()}`, message: 'Archivo recibido correctamente.' };
}

export async function mockGetStatus(jobId: string, tick: number): Promise<StatusResponse> {
  await delay(600);
  const total = 30;
  const processed = Math.min(tick * 3, total);
  const status = processed >= total ? 'COMPLETED' : 'PROCESSING';
  return { jobId, status, processedCount: processed, totalCount: total };
}

export async function mockGetResults(jobId: string): Promise<JobResults> {
  await delay(900);
  return {
    jobId,
    fileName: 'proyectos.csv',
    status: 'COMPLETED',
    processedAt: new Date().toISOString(),
    projects: [
      {
        projectName: 'EcoLadrillos Perú',
        tags: ['SUSTAINABILITY', 'COMMUNITY', 'INNOVATION'],
        status: 'Completado',
        socialImpact: 9,
        technicalFeasibility: 8,
        economicFeasibility: 7,
        riskLevel: 'Bajo',
        executiveSummary:
          'Proyecto con alto potencial de impacto ambiental y social mediante la fabricación de ladrillos ecológicos con materiales reciclados en comunidades vulnerables.',
        strengths: ['Participación comunitaria activa', 'Uso de materiales reciclados', 'Bajo costo de producción'],
        weaknesses: ['Escalabilidad limitada', 'Dependencia de donaciones iniciales'],
        recommendations: ['Buscar alianzas municipales', 'Desarrollar modelo de autofinanciamiento'],
      },
      {
        projectName: 'AguaClara Andina',
        tags: ['WATER_ACCESS', 'RURAL', 'ENVIRONMENT'],
        status: 'Completado',
        socialImpact: 8,
        technicalFeasibility: 7,
        economicFeasibility: 6,
        riskLevel: 'Medio',
        executiveSummary:
          'Sistema de purificación de agua solar para comunidades rurales de los Andes que carecen de acceso a agua potable.',
        strengths: ['Tecnología probada', 'Alto impacto en salud pública'],
        weaknesses: ['Costo inicial elevado', 'Mantenimiento técnico especializado'],
        recommendations: ['Explorar financiamiento del BID', 'Capacitar técnicos locales'],
      },
      {
        projectName: 'TechIncluye',
        tags: ['EDUCATION', 'TECHNOLOGY', 'DIGITAL_INCLUSION'],
        status: 'Completado',
        socialImpact: 7,
        technicalFeasibility: 9,
        economicFeasibility: 8,
        riskLevel: 'Bajo',
        executiveSummary:
          'Plataforma de educación tecnológica para jóvenes en situación de vulnerabilidad con modelo freemium y alianzas empresariales.',
        strengths: ['Modelo escalable', 'Alta demanda comprobada', 'Equipo técnico sólido'],
        weaknesses: ['Competencia de plataformas internacionales', 'Conectividad limitada en zonas rurales'],
        recommendations: ['Priorizar zonas urbanas en fase inicial', 'Gestionar alianzas con ISPs'],
      },
      {
        projectName: 'BioHuerto Urbano',
        tags: ['SUSTAINABILITY', 'COMMUNITY', 'FOOD_SECURITY'],
        status: 'Completado',
        socialImpact: 8,
        technicalFeasibility: 6,
        economicFeasibility: 5,
        riskLevel: 'Alto',
        executiveSummary:
          'Red de huertos urbanos comunitarios para mejorar seguridad alimentaria y reducir huella de carbono en Lima Metropolitana.',
        strengths: ['Impacto medioambiental positivo', 'Fortalece tejido social'],
        weaknesses: ['Dependencia del terreno municipal', 'Alta rotación de voluntarios'],
        recommendations: ['Formalizar convenios con municipios', 'Crear programa de incentivos'],
      },
      {
        projectName: 'SaludDigital Rural',
        tags: ['HEALTH', 'TECHNOLOGY', 'RURAL'],
        status: 'Completado',
        socialImpact: 9,
        technicalFeasibility: 7,
        economicFeasibility: 6,
        riskLevel: 'Medio',
        executiveSummary:
          'Telemedicina accesible para comunidades rurales usando dispositivos de bajo costo y conexión satelital.',
        strengths: ['Cubre necesidad crítica no atendida', 'Modelo replicable'],
        weaknesses: ['Conectividad satelital costosa', 'Regulación médica compleja'],
        recommendations: ['Aliarse con MINSA', 'Aplicar a fondos de innovación social'],
      },
    ],
  };
}

export async function mockGetJobs(): Promise<Job[]> {
  await delay(400);
  return [
    { jobId: 'job-001', fileName: 'proyectos.csv', createdAt: new Date().toISOString(), status: 'COMPLETED', processedCount: 30, totalCount: 30 },
    { jobId: 'job-002', fileName: 'lote2.csv', createdAt: new Date(Date.now() - 3600000).toISOString(), status: 'PROCESSING', processedCount: 18, totalCount: 30 },
    { jobId: 'job-003', fileName: 'prueba.csv', createdAt: new Date(Date.now() - 86400000).toISOString(), status: 'FAILED', processedCount: 0, totalCount: 15 },
  ];
}
