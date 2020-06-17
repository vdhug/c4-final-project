import * as uuid from 'uuid'

import { TodoItem } from '../models/TodoItem';
import { TodoAccess } from '../dataLayer/todosAccess'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { TodoUpdate } from '../models/TodoUpdate';
import { getUserId} from '../auth/utils';

const todoAccess = new TodoAccess()

export async function getAllTodos(
  jwtToken: string
  ): Promise<TodoItem[]> {
  const userId = getUserId(jwtToken);
  return todoAccess.getAllTodos(userId)
}

export async function createTodo(
  createTodoRequest: CreateTodoRequest,
  jwtToken: string
): Promise<TodoItem> {

  const itemId = uuid.v4()
  const userId = getUserId(jwtToken);

  return await todoAccess.createTodo({
    todoId: itemId,
    userId: userId,
    createdAt: new Date().toISOString(),
    name: createTodoRequest.name,
    dueDate: createTodoRequest.dueDate,
    done: false
  })
}

export async function updateTodo(
  itemId: string,
  updateTodoRequest: UpdateTodoRequest,
  jwtToken: string
): Promise<TodoUpdate> {

  // const userId = getUserId(jwtToken)

  return await todoAccess.updateTodo(itemId, {
    name: updateTodoRequest.name,
    dueDate: updateTodoRequest.dueDate,
    done: updateTodoRequest.done
  })
}

export async function deleteTodo(
  itemId: string,
  jwtToken: string
): Promise<object> {

  // const userId = getUserId(jwtToken)

  return await todoAccess.deleteTodo(itemId)
}
