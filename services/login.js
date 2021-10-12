const AWS = require('aws-sdk');
AWS.config.update({
    region:'us-east-1'
})

const util = require('../utils/util');
const bcrypt = require('bcryptjs');
const auth= require('../utils/auth');



const dynamodb = new AWS.DynamoDB.DocumentClient();
const userTable = 'usersTable';


async function login(user){
    const username =user.username;
    const password =user.password;

    if(!user || !username || !password) {
        return util.buildResponse(401,{
            message:'Username and password are required!'
        })
    }

    const dynamodbUser = await getUser(username);
        if(!dynamodbUser || !dynamodbUser.username){
            return util.buildResponse(403,{message:'This user does not exit!'});
        }

        if(!bcrypt.compareSync(password,dynamodbUser.password)){

            return util.buildResponse(403,{message:'your password is incorrect'})


        }

        const userInfo = {
            username:dynamodbUser.username,
            fname:dynamodbUser.fname
        }
        const token = auth.generateToken(userInfo)
        const response = {
            user:userInfo,
            token:token 
        }

        return util.buildResponse(200,response);
    }

    async function getUser(username){
        console.log("username:",username);
     
        const params ={
            TableName: userTable,
            key:{
                username:username
            }
        }
        
        return await dynamodb.get(params).promise().then(response=>{
            console.log("Response:",response);
            return response.Item;
        },error=>{
            //stack and message
            console.error('error occured!',error.message,error.stack);
        }
        )
    }

    module.exports.login=login;
