import * as uuid from 'uuid'

import { TodoItem } from '../models/TodoItem';
import { TodoAccess } from '../dataLayer/todosAccess'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { TodoUpdate } from '../models/TodoUpdate';
// import { getUserId } from '../auth/utils'

const todoAccess = new TodoAccess()

export async function getAllTodos(): Promise<TodoItem[]> {
  return todoAccess.getAllTodos()
}

export async function createTodo(
  createTodoRequest: CreateTodoRequest,
  jwtToken: string
): Promise<TodoItem> {

  const itemId = uuid.v4()
  // const userId = getUserId(jwtToken)

  return await todoAccess.createTodo({
    id: itemId,
    userId: "123",
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
