import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import * as AWS from 'aws-sdk';
import { todoExists } from '../../businessLogic/todos';

const bucketName = process.env.TODOS_S3_BUCKET;
const urlExpiration = process.env.SIGNED_URL_EXPIRATION;

const s3 = new AWS.S3({
  signatureVersion: 'v4'
})

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId;
  
  const authorization = event.headers.Authorization;
  const split = authorization.split(' ')
  const jwtToken = split[1];

  const exist = await todoExists(todoId, jwtToken);

  if (!exist) {
    return {
      statusCode: 404,
      body: JSON.stringify({
        "message": "Item not found"
      })
    }
  }

  const url = getUploadUrl(todoId)

  return {
    statusCode: 200,
    body: JSON.stringify({
      "uploadUrl": url
    })
  }
})

handler.use(
  cors({
      credentials: true
  })
)


function getUploadUrl(todoId: string) {
  return s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: todoId,
    Expires: urlExpiration
  })
}