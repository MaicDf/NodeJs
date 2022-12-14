const express = require ('express');
const bodyParser =require ('body-parser');

//##DECLARING ROUTER
const leaderRouter = express.Router(); 
//conecting to mongoose
const mongoose = require('mongoose');
const Leaders = require('../models/leaders'); //importing the model
leaderRouter.use(bodyParser.json());
//using jwt authentication
const authenticate = require('../authenticate');

//##takes end point as a paramaeter
leaderRouter.route('') //here the path put in index is extended 
//##Selecting the endpoint##
.get((req, res, next) => {
    Leaders.find({})
        .then((leaders) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(leaders);//send this back to the client.
        }, (err) => next(err)) //second parameter brings what happens when the promise is not fulfilled.
        .catch((err) => next(err)); //pass the error to the overall error handler.
    //end of the response
})
.post(authenticate.verifyUser,(req, res, next) => {
    Leaders.create(req.body).
        then((leader) => {
            console.log("leader Created ", leader);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(leader); //send this back to the client.
        }, (err) => next(err)) //second parameter brings what happens when the promise is not fulfilled.
        .catch((err) => next(err)); //pass the error to the overall error handler.);
})
.put(authenticate.verifyUser,(req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /leaders');
})
.delete(authenticate.verifyUser,(req, res, next) => {
    Leaders.collection.drop()
        .then((resp) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(resp);
        }, (err) => next(err)) //second parameter brings what happens when the promise is not fulfilled.
        .catch((err) => next(err));  //pass the error to the overall error handler.);)
    //dangerous operation, must be for priviliged users
}); //all of them are chained together



//###PARAMETERS, retrvieng for the param
leaderRouter.route('/:leaderId') //here the path put in index is extended 
.get((req, res, next) => {
    Leaders.findById(req.params.leaderId)
        .then((leader) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(leader);//send this back to the client.
        }, (err) => next(err)) //second parameter brings what happens when the promise is not fulfilled.
        .catch((err) => next(err)); //pass the error to the overall error handler.
    //end of the response
})
.post(authenticate.verifyUser,(req, res, next) => {
    res.statusCode = 403;
    res.end('post operation not supported on /leaders/:leaderId-> ' + req.params.leaderId);
})

/* Note that update(), updateMany(), findOneAndUpdate(), etc. do not execute save() middleware. If you need save middleware and full validation,
 first query for the document and then save() it. */
.put(authenticate.verifyUser,(req, res, next) => {
    Leaders.findByIdAndUpdate(req.params.leaderId, {
        $set: req.body
    }, { new: true })
        .then((leader) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(leader);//send this back to the client.
        }, (err) => next(err)) //second parameter brings what happens when the promise is not fulfilled.
        .catch((err) => next(err)); //pass the error to the overall error handler.
})
.delete(authenticate.verifyUser,(req, res, next) => {
    Leaders.findByIdAndRemove(req.params.leaderId)
        .then((resp) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(resp);
        }, (err) => next(err)) //second parameter brings what happens when the promise is not fulfilled.
        .catch((err) => next(err));
});

module.exports = leaderRouter;