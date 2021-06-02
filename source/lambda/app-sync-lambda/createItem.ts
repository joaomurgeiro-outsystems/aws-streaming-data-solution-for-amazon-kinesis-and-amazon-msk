const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();
import { Item } from './Item'

async function createItem(item: Item) {
    const params = {
        TableName: process.env.ITEMS_TABLE,
        Item: item
    }

    try {
        await dynamo.put(params).promise()
        return item;
    } catch (err) {
        console.log('DynamoDB error: ', err)
        return null
    }
}

export default createItem;