const AWS = require('aws-sdk');

const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = (event, context, callback) => {

    var params = {
        TableName: "nodes-links-table",
        KeyConditions: {
          "graphId": {
            ComparisonOperator: "EQ",
            AttributeValueList: [ data.partitionKey ]
          },
          /*"nodeId": {
            ComparisonOperator: "BEGINS_WITH",
            AttributeValueList: [ "node#" ]
          }*/
        }
      }

    dynamo.query(params, function(err, data) {
        if (err) { callback(err, null); } 
        else { 
            console.log("Successfull operation"); 
            var response = {
                statusCode: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS'
                },
                body: JSON.stringify(data),
                isBase64Encoded: false
            };
            callback(null, response);
        }
    });
};