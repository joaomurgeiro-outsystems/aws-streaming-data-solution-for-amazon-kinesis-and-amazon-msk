const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

async function listNotes() {
    const params = {
        TableName: process.env.NOTES_TABLE
    }

    try {
        const data = await dynamo.scan(params).promise()
        return data.Items
    } catch (err) {
        console.log('DynamoDB error: ', err)
        return null
    }
}

export default listNotes;