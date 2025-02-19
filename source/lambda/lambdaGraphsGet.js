const AWS = require('aws-sdk');

const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = (event, context, callback) => {

    console.log(event)

    var params = {
        TableName: "graphs-table",
        KeyConditions: {
            "userId": {
                ComparisonOperator: "EQ",
                AttributeValueList: [ event.queryStringParameters.userId ]
            },
        }
    }

    dynamo.query(params, function(err, data) {
        if (err) { callback(err, null); } 
        else { 
            console.log("Successfull operation"); 
            var response = {
                statusCode: 200,
                headers: {
                    //"Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    //"Access-Control-Allow-Methods": "GET,POST,OPTIONS"
                },
                body: JSON.stringify(data),
                isBase64Encoded: false
            };
            callback(null, response);
        }
    });
};