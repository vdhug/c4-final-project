import * as AWS  from 'aws-sdk'
// import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

import { TodoItem } from '../models/TodoItem';
import { TodoUpdate } from '../models/TodoUpdate';

export class TodoAccess {

  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly todosTable = process.env.TODOS_TABLE,
    private readonly todosIdIndex = process.env.TODOS_ID_INDEX,) {
  }

  async getAllTodos(userId: string): Promise<TodoItem[]> {
    console.log('Getting all todos');

    const result = await this.docClient.query({
      TableName: this.todosTable,
      IndexName: this.todosIdIndex,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      },
      ScanIndexForward: false
    }).promise()
  
    return result.Items as TodoItem[];
  }

  async createTodo(todo: TodoItem): Promise<TodoItem> {
    console.log("Getting all todos")
    await this.docClient.put({
      TableName: this.todosTable,
      Item: todo
    }).promise()

    return todo
  }

  async todoExists(todoId: string, userId: string): Promise<boolean> {
    console.log(todoId, userId);
    try {
      const result = await this.docClient.get({
        TableName: this.todosTable,
        Key:{
          "todoId": todoId,
          "userId": userId
        }
      }).promise();

      if (result.Item) {
        return true;
      }
      else {
        return false
      }

      
    } catch (error) {
      console.log("Error checking todo exist")
      return false
    }
  }
  

  async updateTodo(userId: string, todoId: string, todo: TodoUpdate): Promise<TodoUpdate> {
    console.log("Getting all todos")
    await this.docClient.update({
      TableName: this.todosTable,
      Key:{
          "todoId": todoId,
          "userId": userId
      },
      UpdateExpression: 'SET #name = :name, #dueDate=:dueDate, #done=:done',
      ExpressionAttributeValues: {
        ":name": todo.name,
        ":dueDate": todo.dueDate,
        ":done": todo.done
      },
      ExpressionAttributeNames: {
        "#name": "name",
        "#dueDate": "dueDate",
        "#done": "done"
      },
      ReturnValues:"UPDATED_NEW"
    }).promise()

    return todo
  }

  async deleteTodo(todoId: string, userId: string): Promise<object> {
    console.log("Delete todo")
    await this.docClient.delete({
      TableName: this.todosTable,
      Key:{
          "todoId": todoId,
          "userId": userId
      },
      ReturnValues: "ALL_OLD"
    }).promise()

    return {}

  }
  
}

function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    console.log('Creating a local DynamoDB instance')
    return new AWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  }

  return new AWS.DynamoDB.DocumentClient()
}
