const AWS = require('aws-sdk');
AWS.config.update({
    region:'us-east-1'
})
const util = require('../utils/util');

const dynamodb = new AWS.DynamoDB.DocumentClient();
const movieTable = 'movie';

async function addMovies(movieInfo) {
    const id=movieInfo.id;
    const mname =movieInfo.mname;
    const rating =movieInfo.rating;
    const desc =movieInfo.desc;
    

    if(!id|| !mname|| !rating|| !desc){
        return util.buildResponse(401,{
            message: 'Please fill all fields!'
        })
    }
  
   
    
    const movie = {
       id:id,
       mname:mname,
       rating:rating,
       desc:desc
       
    }

    const saveResponse = await saveMovie(movie);
    if(!saveResponse){
        return util.buildResponse(503,{
            message: 'Server error'
        });
    }
    return util.buildResponse(200,{
        id:id
    });

}

async function getMovie(id){
    const params ={
        TableName: movieTable,
        key:{
            id:id
        }
    }

    return await dynamodb.get(params).promise().then(response=>{
        return response.Item;
    },error=>{
        console.error('An error occured1',error.message,error.stack);
    }
    )
}

async function saveMovie(movie){
    const params = {
        TableName : movieTable,
        Item:movie
    }

    return await dynamodb.put(params).promise().then(()=>{
        return true;
    }, error=>{
        console.error('An error occured1',error.message,error.stack);
    })
}

module.exports.addMovies=addMovies;

module.exports.getMovie=getMovie;