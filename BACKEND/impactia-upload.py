import json
import boto3
import os
import uuid

# Inicializamos el cliente de S3
s3_client = boto3.client('s3')

def lambda_handler(event, context):
    # El nombre de tu bucket debe estar en las Variables de Entorno de la Lambda
    bucket_name = os.environ.get('BUCKET_NAME')
    
    if not bucket_name:
        return {
            "statusCode": 500, 
            "headers": {'Access-Control-Allow-Origin': '*'},
            "body": json.dumps({"error": "Falta configurar la variable BUCKET_NAME"})
        }

    # 1. Generar un UploadId único para esta sesión de carga
    upload_id = f"upload-{str(uuid.uuid4())[:8]}"
    file_name = f"{upload_id}.csv"

    try:
        # 2. Generar la URL prefirmada (Presigned URL)
        presigned_url = s3_client.generate_presigned_url(
            'put_object',
            Params={
                'Bucket': bucket_name,
                'Key': file_name,
                'ContentType': 'text/csv'
            },
            ExpiresIn=300 # La URL caduca en 5 minutos
        )

        # 3. Devolver la respuesta al Frontend con CORS habilitado
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*', # Crítico para el Frontend
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
                'Content-Type': 'application/json'
            },
            'body': json.dumps({
                'UploadId': upload_id,
                'PresignedUrl': presigned_url,
                'FileName': file_name,
                'Message': 'Usa la PresignedUrl para hacer un PUT con tu archivo CSV.'
            })
        }
        
    except Exception as e:
        print(f"Error generando URL: {str(e)}")
        return {
            'statusCode': 500,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'No se pudo generar la URL de subida'})
        }