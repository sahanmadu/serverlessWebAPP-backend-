const AWS = require('aws-sdk');
AWS.config.update({
    region:'us-east-1'
})

const util = require('../utils/util')
const bcrypt = require('bcryptjs');



const dynamodb = new AWS.DynamoDB.DocumentClient();
const userTable = 'usersTable';

async function register(userInfo) {
    const fname =userInfo.fname;
    const lname =userInfo.lname;
    const username =userInfo.username;
    const password =userInfo.password;
    const cpassword =userInfo.cpassword;
    const dob =userInfo.dob;
    const email =userInfo.email;
    const country =userInfo.country;
    const state =userInfo.state;
    const pnumber =userInfo.pnumber;

    if(!fname|| !lname|| !username|| !password|| !cpassword|| !dob|| !email|| !country|| !state|| !pnumber){
        return util.buildResponse(401,{
            message: 'Please fill all fields!'
        })
    }
    if(password != cpassword){
        return util.buildResponse(401,{
            message: 'Passwords are not maching!'
        })
    }
    const dynamodbUser =await getUser(username.toLowerCase().trim());
    if(dynamodbUser && dynamodbUser.username){
        return util.buildResponse(401,{
            message: 'Username already exits!'
        })
    }

    const enctyptPassword =bcrypt.hashSync(password.trim(),10);
    const user = {
        fname:fname,
        lname:lname,
        username:username.toLowerCase().trim(),
        password:enctyptPassword,
        cpassword:enctyptPassword,
        dob:dob,
        email:email,
        country:country,
        state:state,
        pnumber:pnumber
    }

    const saveResponse = await saveUser(user);
    if(!saveResponse){
        return util.buildResponse(503,{
            message: 'Server error'
        });
    }
    return util.buildResponse(200,{
        username:username
    });

}

async function getUser(username){
    const params ={
        TableName: userTable,
        key:{
            username:username
        }
    }

    return await dynamodb.get(params).promise().then(response=>{
        return response.Item;
    },error=>{
        console.error('error occured!');
    }
    )
}

async function saveUser(user){
    const params = {
        TableName : userTable,
        Item:user
    }

    return await dynamodb.put(params).promise().then(()=>{
        return true;
    }, error=>{
        console.error('An error occured1');
    })
}

module.exports.register=register;