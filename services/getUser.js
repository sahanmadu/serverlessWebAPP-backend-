const AWS = require('aws-sdk');
AWS.config.update({
    region:'us-east-1'
})

const dynamodb = new AWS.DynamoDB.DocumentClient();
const userTable = 'usersTable';


async function getDetil(username){
    const params={
        TableName:userTable,
        key:{
            'username':username
        }
    }
    return await dynamodb.get(params).promise().then((response) => {
        return buildResponse(200,response.Item);
    },(error) => {
        console.error('an error occured!');
    }
    );
}