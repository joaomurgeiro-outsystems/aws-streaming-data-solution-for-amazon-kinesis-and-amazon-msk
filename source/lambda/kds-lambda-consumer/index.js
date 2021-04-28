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
    const dynamo = new AWS.DynamoDB.DocumentClient();

    for (const record of event.Records) {
        const data = JSON.parse( Buffer.from(record.kinesis.data, 'base64').toString('ascii') ); // Base64 -> JSON
        console.log(`Decoded payload: ${data}`);
        console.log(`Event Type: ${data.eventType}`);
        const Item = {};
        const Key = {};

        switch(data.eventType) {
          case 'graphPut':
            Item['graphId'] = data.partitionKey;
            Item['info'] = JSON.stringify(data.info);

            dynamo.put({TableName: "graph-table", Item}, function(err, data) {
                if (err) { callback(err, null); } 
                else { console.log("Successfull operation"); callback(null, data); }
              });

          break;
          case 'nodePut':
            Item['graphId'] = data.partitionKey;
            Item['nodeId'] = data.sortKey;
            Item['info'] = JSON.stringify(data.info);

            dynamo.put({TableName: "nodes-table", Item}, function(err, data) {
                if (err) { callback(err, null); } 
                else { console.log("Successfull operation"); callback(null, data); }
              });

          break;
          case 'graphGet':
            Key['graphId'] = data.partitionKey;

            dynamo.get({TableName: "graph-table", Key}, function(err, data) {
                if (err) { callback(err, null); } 
                else { console.log("Successfull operation"); callback(null, data); }
              });

          break;
          case 'nodeGet':
            Key['graphId'] = data.partitionKey;
            Key['nodeId'] = data.sortKey;

            dynamo.get({TableName: "nodes-table", Key}, function(err, data) {
                if (err) { callback(err, null); } 
                else { console.log("Successfull operation"); console.log(data); callback(null, data); }
              });

          break;
          case 'graphDelete':
            Key['graphId'] = data.partitionKey;

            dynamo.delete({TableName: "graph-table", Key}, function(err, data) {
                if (err) { callback(err, null); } 
                else { console.log("Successfull operation"); callback(null, data); }
              });

          break;
          case 'nodeDelete':
            Key['graphId'] = data.partitionKey;
            Key['nodeId'] = data.sortKey;

            dynamo.delete({TableName: "nodes-table", Key}, function(err, data) {
                if (err) { callback(err, null); } 
                else { console.log("Successfull operation"); callback(null, data); }
              });

          break;
          default:
            console.log("Event Type not indentified!")
        }
    }

    return `Successfully processed ${event.Records.length} records.`;
};
