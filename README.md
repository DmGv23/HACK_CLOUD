# ⚡ ImpactIA
> Evaluación inteligente de proyectos sociales mediante IA Generativa en AWS

**Equipo:** Momazos CloudComp · Hackathon Cloud 2026

| Integrante | Código |
|---|---|
| Raúl Janampa | 202410411 |
| Danna Nickol Gala Vásquez | 202410573 |
| Eduardo Salvador Guevara Vargas | 202410096 |

---

## 🧩 El Problema

Las ONGs, municipalidades y entidades financiadoras reciben decenas (a veces cientos) de propuestas de proyectos sociales que deben evaluarse manualmente en criterios como impacto social, viabilidad técnica y económica, y nivel de riesgo. Este proceso es **lento, costoso e imposible de escalar**.

## 💡 La Solución

**ImpactIA** automatiza esa evaluación preliminar. El usuario sube un CSV con descripciones de proyectos y el sistema devuelve, por cada uno:

- Puntajes de impacto social, viabilidad técnica y económica (1–10)
- Nivel de riesgo (Alto / Medio / Bajo)
- Resumen ejecutivo, fortalezas, debilidades y recomendaciones

Todo procesado de forma asíncrona mediante una arquitectura serverless en AWS.

---

## 🏗️ Arquitectura

```
Frontend (React)
    │
    ▼
API Gateway ──► Lambda Upload ──► S3 (CSV crudo)
                                       │
                                       ▼ (evento S3)
                               Lambda Splitter ──► SQS Queue
                                                       │
                                                       ▼ (trigger)
                                               Lambda Processor ──► Groq API (IA)
                                                       │
                                                       ▼
                                                  DynamoDB
                                                       │
                                                       ▼
API Gateway ──► Lambda Get Results ◄──────────────────┘
    │
    ▼
Frontend muestra resultados
```

| Servicio | Rol |
|---|---|
| **API Gateway** | Endpoints HTTP públicos |
| **Lambda × 4** | Lógica de negocio serverless |
| **S3** | Almacenamiento de archivos CSV |
| **SQS** | Desacoplamiento asíncrono del procesamiento |
| **DynamoDB** | Resultados de la evaluación |
| **Groq API** | Modelo LLM para el análisis con IA |

---

## 📁 Estructura del repositorio

```
├── BACKEND/
│   ├── impactia-upload.py          # Lambda: genera Presigned URL de S3
│   ├── impactia-splitter.py        # Lambda: lee CSV y envía a SQS
│   ├── ImpactIALambdaProcessor.py  # Lambda: llama a Groq y guarda en DynamoDB
│   └── impactia-get-results.py     # Lambda: sirve resultados al frontend
└── FRONTEND/HACKCLOUD/
    └── src/
        ├── pages/        # HomePage, ResultsPage, HistoryPage
        ├── components/   # ProjectCard, ScoreBar, Sidebar...
        └── services/     # api.ts (cliente HTTP hacia API Gateway)
```

---

## 🚀 Despliegue rápido

**Prerrequisitos:** AWS CLI configurado · Python 3.12 · API Key de [Groq](https://console.groq.com)

### 1. Infraestructura base

```bash
# Bucket S3
aws s3api create-bucket --bucket impactia-input-bucket --region us-east-1

# Cola SQS (visibility timeout = 300s)
aws sqs create-queue --queue-name impactia-processing-queue \
  --attributes VisibilityTimeout=300

# Tabla DynamoDB (PK: UploadId, SK: ProjectId)
aws dynamodb create-table \
  --table-name ImpactIAResults \
  --attribute-definitions AttributeName=UploadId,AttributeType=S AttributeName=ProjectId,AttributeType=S \
  --key-schema AttributeName=UploadId,KeyType=HASH AttributeName=ProjectId,KeyType=RANGE \
  --billing-mode PAY_PER_REQUEST
```

### 2. Desplegar las Lambdas

Crear cada función en la consola AWS con **Python 3.12** y su rol IAM correspondiente:

| Lambda | Archivo fuente | Trigger | Variable de entorno |
|---|---|---|---|
| `impactia-upload` | `impactia-upload.py` | API Gateway POST /upload | `BUCKET_NAME` |
| `impactia-splitter` | `impactia-splitter.py` | S3 ObjectCreated (.csv) | — |
| `impactia-processor` | `ImpactIALambdaProcessor.py` | SQS (batch=1) | `GROQ_API_KEY` |
| `impactia-get-results` | `impactia-get-results.py` | API Gateway GET /results | — |

> ⚠️ Timeout recomendado para `impactia-processor`: **300 segundos**

### 3. API Gateway

Crear una **API HTTP** y configurar las rutas:

```
POST /upload   → impactia-upload
GET  /results  → impactia-get-results
```

Habilitar CORS con `Access-Control-Allow-Origin: *`.

### 4. Frontend

```bash
cd FRONTEND/HACKCLOUD
npm install
npm run dev
```

Actualizar `BASE_URL` en `src/services/api.ts` con la URL del API Gateway.

---

## 🛠️ Stack tecnológico

`React 19` · `TypeScript` · `Tailwind CSS` · `Recharts` · `Python 3.12` · `AWS Lambda` · `AWS S3` · `AWS SQS` · `AWS DynamoDB` · `AWS API Gateway` · `Groq API`

---

*Manual de despliegue completo disponible en la documentación del proyecto.*
