import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { updateTodo } from '../../businessLogic/todos';

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)

  const authorization = event.headers.Authorization;
  const split = authorization.split(' ')
  const jwtToken = split[1];

  try {
    const item = await updateTodo(todoId, updatedTodo, jwtToken);
    return {
        statusCode: 201,
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
            item
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
