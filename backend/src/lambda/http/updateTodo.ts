import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { updateTodo, todoExists } from '../../businessLogic/todos';

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)

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

  try {
    const item = await updateTodo(todoId, jwtToken, updatedTodo);
    return {
      statusCode: 200,
      body: JSON.stringify({
        item
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
