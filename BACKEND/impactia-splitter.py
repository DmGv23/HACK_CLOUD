import json
import boto3

s3 = boto3.client('s3')
sqs = boto3.client('sqs')

# TU COLA SQS
QUEUE_URL = "https://sqs.us-east-1.amazonaws.com/488651307929/impactia-processing-queue"

def lambda_handler(event, context):
    try:
        record = event['Records'][0]
        bucket = record['s3']['bucket']['name']
        key = record['s3']['object']['key']

        upload_id = key.split('.')[0]

        # Descargar el archivo desde S3
        response = s3.get_object(Bucket=bucket, Key=key)
        
        # Leer el contenido como texto plano bruto
        raw_text = response['Body'].read().decode('utf-8')

        # Enviar el texto libre completo a SQS en un solo mensaje
        message = {
            "UploadId": upload_id, 
            "RawText": raw_text
        }

        sqs.send_message(
            QueueUrl=QUEUE_URL,
            MessageBody=json.dumps(message)
        )

        return {"statusCode": 200, "body": "Texto libre enviado a SQS exitosamente"}

    except Exception as e:
        print(f"ERROR: {str(e)}")
        return {"statusCode": 500, "body": str(e)}