import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { CreateTodoRequest } from '../../requests/CreateTodoRequest';
import { createTodo } from '../../businessLogic/todos';

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const newTodo: CreateTodoRequest = JSON.parse(event.body)

  const authorization = event.headers.Authorization;
  const split = authorization.split(' ')
  const jwtToken = split[1];

  try {
    const newItem = await createTodo(newTodo, jwtToken);
    return {
        statusCode: 201,
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
            newItem
        })
    }
  } catch (error) {
    return {
        statusCode: 400,
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
            error
        })
    }
  }


  
}
