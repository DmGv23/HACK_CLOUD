import json
import boto3
from decimal import Decimal
from boto3.dynamodb.conditions import Key

# 1. ESTA ES LA CLAVE: Un "traductor" para que Python entienda los números de DynamoDB
class DecimalEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Decimal):
            # Si el número es entero, lo pasa a int, si tiene decimales, a float
            return int(obj) if obj % 1 == 0 else float(obj)
        return super(DecimalEncoder, self).default(obj)

# Inicializamos el recurso de DynamoDB
dynamodb = boto3.resource('dynamodb')
TABLE_NAME = 'ImpactIAResults'
table = dynamodb.Table(TABLE_NAME)

def lambda_handler(event, context):
    try:
        query_params = event.get('queryStringParameters') or {}
        upload_id = query_params.get('uploadId')
        
        if not upload_id:
            return {
                'statusCode': 400,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                'body': json.dumps({'error': 'Falta el parámetro uploadId'})
            }
        
        print(f"Buscando resultados en DynamoDB para: {upload_id}")
        
        # 2. Obtener los datos de la BD
        response = table.query(
            KeyConditionExpression=Key('UploadId').eq(upload_id)
        )
        
        items = response.get('Items', [])
        
        # 3. Empaquetar y enviar usando nuestro Traductor de Decimales (cls=DecimalEncoder)
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,OPTIONS',
                'Content-Type': 'application/json'
            },
            'body': json.dumps(items, cls=DecimalEncoder) # <--- AQUÍ SE APLICA LA MAGIA
        }
        
    except Exception as e:
        print(f"ERROR consultando DynamoDB: {str(e)}")
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            # Por si acaso otro error cae aquí, lo mandamos como string
            'body': json.dumps({'error': f"Error interno: {str(e)}"})
        }