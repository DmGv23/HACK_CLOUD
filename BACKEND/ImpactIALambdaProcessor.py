import json
import boto3
import os
import urllib.request
import urllib.error

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('ImpactIAResults')

def lambda_handler(event, context):
    # 1. OBTENER Y LIMPIAR LA API KEY (Evita errores de espacios invisibles de AWS)
    raw_key = os.environ.get('GROQ_API_KEY', '')
    GROQ_API_KEY = raw_key.strip()
    
    if not GROQ_API_KEY:
        print("ERROR FATAL: La variable GROQ_API_KEY está vacía.")
        return {"statusCode": 200, "body": "Falta API Key"}

    for record in event['Records']:
        payload = json.loads(record['body'])
        upload_id = payload.get('UploadId')
        raw_text = payload.get('RawText', '')

        print(f"Procesando lote: {upload_id}")

        # 2. EL PROMPT ESTRUCTURADO PARA GROQ
        system_prompt = """
        Eres un evaluador experto de proyectos sociales. El usuario te enviará un texto en bruto.
        Tu misión:
        1. Analiza el texto. Si NO tiene proyectos sociales, devuelve exactamente: {"proyectos": []}
        2. Si hay proyectos, extráelos y evalúalos otorgando puntajes del 1 al 10 en Impacto, Técnico y Económico.
        3. Genera un breve resumen, evalúa el Riesgo (Alto, Medio, Bajo) y extrae Fortalezas, Debilidades y Recomendaciones en formato de listas.
        4. Devuelve ESTRICTAMENTE un objeto JSON con la clave "proyectos". No incluyas texto adicional.
        
        Formato esperado:
        {
          "proyectos": [
            {
              "ProjectId": "proj-01",
              "ProjectName": "Nombre extraído",
              "ImpactScore": 8,
              "TechnicalScore": 7,
              "EconomicScore": 6,
              "Risk": "Bajo",
              "Summary": "Breve resumen del proyecto aquí...",
              "Status": "Evaluado",
              "Fortalezas": ["Alta participación comunitaria"],
              "Debilidades": ["Presupuesto insuficiente"],
              "Recomendaciones": ["Buscar alianzas municipales"]
            }
          ]
        }
        """

        # 3. EL CUERPO EXACTO QUE EXIGE GROQ
        data = {
            "model": "openai/gpt-oss-20b",
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": raw_text}
            ],
            "response_format": {"type": "json_object"},
            "temperature": 0.3
        }

        req = urllib.request.Request(
            "https://api.groq.com/openai/v1/chat/completions",
            data=json.dumps(data).encode('utf-8'),
            headers={
                'Authorization': f'Bearer {GROQ_API_KEY}',
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0'
            }
        )

        try:
            print("Enviando petición a Groq...")
            with urllib.request.urlopen(req) as response:
                result = json.loads(response.read().decode('utf-8'))
                
                groq_response = result['choices'][0]['message']['content']
                json_data = json.loads(groq_response)
                proyectos = json_data.get('proyectos', [])

                if not proyectos:
                    print("La IA determinó que el texto no contenía proyectos.")
                    continue

                # 6. GUARDAR EN DYNAMODB (Actualizado con todos los atributos)
                for p in proyectos:
                    item_to_save = {
                        'UploadId': str(upload_id),
                        'ProjectId': str(p.get('ProjectId', 'unk-01')),
                        'ProjectName': str(p.get('ProjectName', 'Sin nombre')),
                        'ImpactScore': int(p.get('ImpactScore', 0)),
                        'TechnicalScore': int(p.get('TechnicalScore', 0)),
                        'EconomicScore': int(p.get('EconomicScore', 0)),
                        'Risk': str(p.get('Risk', 'N/A')),
                        'Summary': str(p.get('Summary', 'Sin resumen')),
                        'Status': str(p.get('Status', 'Completado')),
                        # Las listas las guardamos directamente, DynamoDB las entiende como 'List'
                        'Fortalezas': p.get('Fortalezas', []),
                        'Debilidades': p.get('Debilidades', []),
                        'Recomendaciones': p.get('Recomendaciones', [])
                    }
                    table.put_item(Item=item_to_save)
                    print(f"¡Éxito! Guardado en BD: {item_to_save['ProjectName']}")

        # 🚨 CAPTURA AVANZADA DE ERRORES DE LA API
        except urllib.error.HTTPError as e:
            # Si Groq rechaza la petición, leemos SU mensaje de error exacto
            error_body = e.read().decode('utf-8')
            print(f"🚨 GROQ RECHAZÓ LA PETICIÓN (HTTP {e.code}): {error_body}")
            print(f"Asegúrate de que la llave empiece con: {GROQ_API_KEY[:5]}...")
            
        except Exception as e:
            print(f"🚨 OTRO ERROR: {str(e)}")
            
    # Devolvemos 200 siempre para que SQS borre el mensaje y NO haga un bucle infinito
    return {"statusCode": 200, "body": "Lote procesado"}