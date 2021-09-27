const AWS = require('aws-sdk');

const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = (event, context, callback) => {

    console.log("Event: ")
    console.log(event)

    var params = {
        TableName: "graphs-table",
        Item:{
            "userId": event.queryStringParameters.userId,
            "graphId": event.queryStringParameters.graphId,
            "graphName": event.queryStringParameters.graphName
        }
    }

    dynamo.put(params, function(err, result) {
        if (err) { callback(err, null); } 
        else { 
            console.log("Successfull operation"); 
            var response = {
                statusCode: 200,
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET,POST,OPTIONS"
                },
                body: JSON.stringify(result),
                isBase64Encoded: false
            };
            callback(null, response);
        } 
    });
};