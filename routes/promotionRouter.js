const express = require ('express');
const bodyParser =require ('body-parser');

//##DECLARING ROUTER
const pRouter = express.Router(); 

pRouter.use(bodyParser.json());

//##takes end point as a paramaeter
pRouter.route('/') //here the path put in index is extended 
//##Selecting the endpoint##
.all((req,res,next)=>{ //app.all => all verbs
    //callback function
        res.statusCode = 200;
        res.setHeader('Content-Type','text/plain');
        next();//=>Will continue on to look for additional specification >app.get,app.post...etc
    })
//Just for get request, this will be executed right after app.all (modified >res<) when there is a get request.
.get((req,res,next)=>{
    res.end('Will send all the promotions to you!');
    //end of the response
})
.post((req,res,next)=>{
    res.end('will add the promotion: '+ req.body.name + 'with details: '+req.body.description); 
})
.put((req,res,next)=>{
    res.statusCode=403;
    res.end('PUT operation not supported on /promotions'); 
})
.delete((req,res,next)=>{
    res.end('Deleting all the promotions to you!');
    //dangerous operation, must be for priviliged users
}); //all of them are chained together


//###PARAMETERS, retrvieng for the param
pRouter.route('/:promotionId') //here the path put in index is extended 
.get((req,res,next)=>{
    res.end('Will send details of the promotion! '+ req.params.promotionId+ ' to you');
    //end of the response
})
.post((req,res,next)=>{
    res.statusCode=403;
    res.end('post operation not supported on /promotions/:promotionId-> '+ req.params.promotionId); 
})
.put((req,res,next)=>{
    res.write('Updating the dish: ' + req.params.promotionId+'\n');
    res.end('Will update the dish: '+req.body.name+' with details '+ req.body.description); 
})
.delete((req,res,next)=>{
    res.end('Deleting dish!: ' + req.params.promotionId);
    //dangerous operation, must be for priviliged users
});  
module.exports = pRouter;