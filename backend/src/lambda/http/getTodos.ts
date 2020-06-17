import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import { getAllTodos } from '../../businessLogic/todos';

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const authorization = event.headers.Authorization;
  const split = authorization.split(' ')
  const jwtToken = split[1];

  try {
    const todos = await getAllTodos(jwtToken);

    return {
        statusCode: 200,
        body: JSON.stringify({
            items: todos
        })
    }
      
  } catch (error) {
    return {
        statusCode: 400,
        body: JSON.stringify({
            error
        })
    }
  }
  
  
  
})

handler.use(
    cors({
        credentials: true
    })
)

