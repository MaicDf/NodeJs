const express = require ('express');
const bodyParser =require ('body-parser');

//##DECLARING ROUTER
const leaderRouter = express.Router(); 

leaderRouter.use(bodyParser.json());

//##takes end point as a paramaeter
leaderRouter.route('') //here the path put in index is extended 
//##Selecting the endpoint##
.all((req,res,next)=>{ //app.all => all verbs
    //callback function
        res.statusCode = 200;
        res.setHeader('Content-Type','text/plain');
        next();//=>Will continue on to look for additional specification >app.get,app.post...etc
    })
//Just for get request, this will be executed right after app.all (modified >res<) when there is a get request.
.get((req,res,next)=>{
    res.end('Will send all the Leaders to you!');
    //end of the response
})
.post((req,res,next)=>{
    res.end('will add the leader: '+ req.body.name + 'with details: '+req.body.description); 
})
.put((req,res,next)=>{
    res.statusCode=403;
    res.end('PUT operation not supported on /Leaders'); 
})
.delete((req,res,next)=>{
    res.end('Deleting all the Leaders to you!');
    //dangerous operation, must be for priviliged users
}); //all of them are chained together


//###PARAMETERS, retrvieng for the param
leaderRouter.route('/:leaderId') //here the path put in index is extended 
.get((req,res,next)=>{
    res.end('Will send details of the leader! '+ req.params.leaderId+ ' to you');
    //end of the response
})
.post((req,res,next)=>{
    res.statusCode=403;
    res.end('post operation not supported on /Leaders/:leaderId-> '+ req.params.leaderId); 
})
.put((req,res,next)=>{
    res.write('Updating the leader: ' + req.params.leaderId+'\n');
    res.end('Will update the leader: '+req.body.name+' with details '+ req.body.description); 
})
.delete((req,res,next)=>{
    res.end('Deleting leader!: ' + req.params.leaderId);
    //dangerous operation, must be for priviliged users
});  
module.exports = leaderRouter;