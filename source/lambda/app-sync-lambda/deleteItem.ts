const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();
import { Item } from './Item'

async function deleteItem(item: Item) {
    const params = {
        TableName: process.env.ITEMS_TABLE,
        Key:{
            "id": item.id
          }
    }

    try {
        await dynamo.delete(params).promise()
        return item;
    } catch (err) {
        console.log('DynamoDB error: ', err)
        return null
    }
}

export default deleteItem;