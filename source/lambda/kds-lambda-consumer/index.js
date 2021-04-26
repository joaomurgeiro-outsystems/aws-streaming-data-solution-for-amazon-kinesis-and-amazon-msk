/*********************************************************************************************************************
 *  Copyright 2020-2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.                                      *
 *                                                                                                                    *
 *  Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance    *
 *  with the License. A copy of the License is located at                                                             *
 *                                                                                                                    *
 *      http://www.apache.org/licenses/LICENSE-2.0                                                                    *
 *                                                                                                                    *
 *  or in the 'license' file accompanying this file. This file is distributed on an 'AS IS' BASIS, WITHOUT WARRANTIES *
 *  OR CONDITIONS OF ANY KIND, express or implied. See the License for the specific language governing permissions    *
 *  and limitations under the License.                                                                                *
 *********************************************************************************************************************/
var AWS = require('aws-sdk');

exports.handler = (event, context, callback) => {
    console.log(`Received event: ${JSON.stringify(event, null, 2)}`);

    for (const record of event.Records) {
        const payload = Buffer.from(record.kinesis.data, 'base64').toString('ascii');
        //const graphId = Buffer.from(record.kinesis.partitionKey, 'base64').toString('ascii');
        console.log(`Partition Key: ${record.kinesis.partitionKey}`);
        console.log(`Decoded payload: ${payload}`);
        
        const dynamo = new AWS.DynamoDB.DocumentClient();
        const TableName = 'DynamoDBTable';
        const Item = {};
        Item['graphId'] = record.kinesis.partitionKey;
        Item['data'] = payload;
        dynamo.put({TableName, Item}, function(err, data) {
            if (err) {
              console.log("Error", err);
              callback(err, null);
            } else {
              console.log("Success", data);
              callback(null, data);
            }
          });
    }

    return `Successfully processed ${event.Records.length} records.`;
};
