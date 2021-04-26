import * as cdk from '@aws-cdk/core';
import * as dynamodb from '@aws-cdk/aws-dynamodb';

export class DynamoDB extends cdk.Construct {

    constructor(scope: cdk.Construct, id: string) {
        super(scope, id);

        /*const table = */new dynamodb.Table(this, 'DynamoDBTable', {
            partitionKey: { name: 'graphId', type: dynamodb.AttributeType.STRING },
            tableName: "DynamoDBTable"
        });

        //table.grantReadWriteData(dynamoLambda);
    }
}