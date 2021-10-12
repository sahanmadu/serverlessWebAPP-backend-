
const registerThisService= require('./services/register');
const loginThisService= require('./services/login');
const verifyThisService= require('./services/verify');
const getThisService = require('./services/getUser');
const addThisService = require('./services/addMovies');

const util = require('./utils/util');

const appPath = '/health';
const registerPath ='/register';
const addMoviePath ='/add';
const loginPath ='/login';
const verifyPath ='/verify';
const getDetailsPath='/user';
const getMoviePath='/showMovie';


exports.handler = async (event) => {
console.log('Request Event', event);
let response;

switch(true){ // checking http methods 

    //testing api
    case event.httpMethod === 'GET' && event.path === appPath:
        response=util.buildResponse(200);
        break;
        //signup
     case event.httpMethod === 'POST' && event.path === registerPath:
        const registerBody = JSON.parse(event.body);

        response=await registerThisService.register(registerBody);
        break;
        //login
    case event.httpMethod === 'POST' && event.path === loginPath:
        const loginBody = JSON.parse(event.body);

        response=await loginThisService.login(loginBody);
        break;

     /*case event.httpMethod === 'GET' && event.path === getDetailsPath:
        const userBody = JSON.parse(event.body);

         response=getThisService.getDetial(loginBody);
        break;
    */   
        //verify user 
    case event.httpMethod === 'POST' && event.path === verifyPath:
        const verifyBody = JSON.parse(event.body);
        response=verifyThisService.verify(verifyBody);
        break;

        // add movies route
    case event.httpMethod === 'POST' && event.path === addMoviePath:
        const addMovieBody = JSON.parse(event.body);

        response=await addThisService.addMovies(addMovieBody);
        break;
        //get movie
        case event.httpMethod === 'GET' && event.path === getMoviePath:
        const getMovieBody = JSON.parse(event.body);

        response=await addThisService.getMovie(getMovieBody);
        break;
        
        default:
            response=util.buildResponse(404,'404 not found');
        }
        return response;

        }

