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
 var fetch = require('node-fetch');

 exports.handler = (event, context, callback) => {
     console.log(`Received event: ${JSON.stringify(event, null, 2)}`);
     const dynamo = new AWS.DynamoDB.DocumentClient();
 
     event.Records.forEach(record => {
       const data = JSON.parse( Buffer.from(record.kinesis.data, 'base64').toString('ascii') ); // Base64 -> JSON
       //console.log(`Event Type: ${data.eventType}`);
 
       switch(data.eventType) {
         case 'put':     // insert node or link

          // Insert in DynamoDB
           var params = {
             TableName: "nodes-links-table",
             Item:{
               "graphId": data.partitionKey,
               "nodeLinkId": data.sortKey,
               "type": data.type,
               "info":data.info   // JSON.stringify
             }
           }
 
           dynamo.put(params, function(err, data) {
               if (err) { callback(err, null); } 
               else { 
                 //console.log("Successfull operation"); 
                 var response = {
                   statusCode: 200,
                   headers: {
                       "Access-Control-Allow-Origin": "*",
                   },
                   body: JSON.stringify(data),
                   isBase64Encoded: false
                 };
                 callback(null, response);
                 console.log(response)
               } 
           });

          // Send POST mutation request to AppSync API
          const mutationCreate = JSON.stringify({
            query: `mutation {
              createItem(item: {
                id: ${JSON.stringify(data.sortKey)}
                type: ${JSON.stringify(data.type)}
                graphId: ${JSON.stringify(data.partitionKey)}
                info: "info"
              }) {
                id type graphId info
              }
            }`
          });

          const optionsCreate = {
            method: 'POST',
            body: mutationCreate,
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': process.env.GRAPHQL_KEY
            }
          };

          fetch(process.env.GRAPHQL_URL, optionsCreate)
              .then(res => res.json())
              .then(json => {
                  console.log(`JSON Response = ${JSON.stringify(json, null, 2)}`);
                  callback(null, event);
              })
              .catch(err => {
                  console.error(`FETCH ERROR: ${JSON.stringify(err, null, 2)}`);
                  callback(err);
              });
          
         break; 
         case 'delete':     // delete one node or link
           var params = {
             TableName: "nodes-links-table",
             Key:{
               "graphId": data.partitionKey,
               "nodeLinkId": data.sortKey
             }
           }
 
           dynamo.delete(params, function(err, data) {
               if (err) { callback(err, null); } 
               else { console.log("Successfull operation"); callback(null, data); }
             });

          // Send POST mutation request to AppSync API
          const mutationDelete = JSON.stringify({
            query: `mutation {
              deleteItem(item: {
                id: ${JSON.stringify(data.sortKey)}
                type: ${JSON.stringify(data.type)}
                graphId: ${JSON.stringify(data.partitionKey)}
                info: ""
              }) {
                id type graphId info
              }
            }`
          });

          const optionsDelete = {
            method: 'POST',
            body: mutationDelete,
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': process.env.GRAPHQL_KEY
            }
          };

          fetch(process.env.GRAPHQL_URL, optionsDelete)
              .then(res => res.json())
              .then(json => {
                  console.log(`JSON Response = ${JSON.stringify(json, null, 2)}`);
                  callback(null, event);
              })
              .catch(err => {
                  console.error(`FETCH ERROR: ${JSON.stringify(err, null, 2)}`);
                  callback(err);
              });
          
 
         break;
         default:
           console.log("Event Type not indentified!")
       }
 
       return `Successfully processed ${event.Records.length} records.`;
     })
 };