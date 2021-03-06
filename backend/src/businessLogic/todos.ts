import * as uuid from 'uuid'

import { TodoItem } from '../models/TodoItem';
import { TodoAccess } from '../dataLayer/todosAccess'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { TodoUpdate } from '../models/TodoUpdate';
import { getUserId} from '../auth/utils';

const bucketName = process.env.TODOS_S3_BUCKET;

const todoAccess = new TodoAccess()

export async function getAllTodos(
  jwtToken: string
  ): Promise<TodoItem[]> {
  const userId = getUserId(jwtToken);
  return todoAccess.getAllTodos(userId)
}

export async function todoExists(
  todoId: string,
  jwtToken: string
  ): Promise<boolean> {
  const userId = getUserId(jwtToken);
  return todoAccess.todoExists(todoId, userId)
}

export async function createTodo(
  createTodoRequest: CreateTodoRequest,
  jwtToken: string
): Promise<TodoItem> {

  const itemId = uuid.v4()
  const userId = getUserId(jwtToken);

  if (createTodoRequest.name.trim() === "") {
    throw Error("Name of TODO is required");
  }

  return await todoAccess.createTodo({
    todoId: itemId,
    userId: userId,
    createdAt: new Date().toISOString(),
    name: createTodoRequest.name,
    dueDate: createTodoRequest.dueDate,
    done: false,
    attachmentUrl: `https://${bucketName}.s3.amazonaws.com/${itemId}`
  })
}

export async function updateTodo(
  itemId: string,
  jwtToken: string,
  updateTodoRequest: UpdateTodoRequest
): Promise<TodoUpdate> {

  const userId = getUserId(jwtToken);
  return await todoAccess.updateTodo(userId, itemId, {
    name: updateTodoRequest.name,
    dueDate: updateTodoRequest.dueDate,
    done: updateTodoRequest.done
  })
}

export async function deleteTodo(
  itemId: string,
  jwtToken: string
): Promise<object> {
  const userId = getUserId(jwtToken);
  return await todoAccess.deleteTodo(itemId, userId)
}
