const express = require('express');
const bodyParser = require('body-parser');

//conecting to mongoose
const mongoose = require('mongoose');
const Dishes = require('../models/dishes'); //importing the model


//##DECLARING ROUTER
const dishRouter = express.Router();

dishRouter.use(bodyParser.json()); //this parses the body of the requests into JSON

//##takes end point as a paramaeter
dishRouter.route('') //here the path put in index is extended 
    //##Selecting the endpoint##

    //Just for get request, this will be executed right after app.all (modified >res<) when there is a get request.
    .get((req, res, next) => {
        Dishes.find({})
            .then((dishes) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dishes);//send this back to the client.
            }, (err) => next(err)) //second parameter brings what happens when the promise is not fulfilled.
            .catch((err) => next(err)); //pass the error to the overall error handler.
        //end of the response
    })
    .post((req, res, next) => {
        Dishes.create(req.body).
            then((dish) => {
                console.log("Dish Created ", dish);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish); //send this back to the client.
            }, (err) => next(err)) //second parameter brings what happens when the promise is not fulfilled.
            .catch((err) => next(err)); //pass the error to the overall error handler.);
    })
    .put((req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /dishes');
    })
    .delete((req, res, next) => {
        Dishes.remove({})
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err)) //second parameter brings what happens when the promise is not fulfilled.
            .catch((err) => next(err)); //pass the error to the overall error handler.);)
        //dangerous operation, must be for priviliged users
    }); //all of them are chained together


//###PARAMETERS, retrvieng for the param
dishRouter.route('/:dishId') //here the path put in index is extended 
    .get((req, res, next) => {
        Dishes.findById(req.params.dishId)
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish);//send this back to the client.
            }, (err) => next(err)) //second parameter brings what happens when the promise is not fulfilled.
            .catch((err) => next(err)); //pass the error to the overall error handler.
        //end of the response
    })
    .post((req, res, next) => {
        res.statusCode = 403;
        res.end('post operation not supported on /dishes/:dishId-> ' + req.params.dishId);
    })
    .put((req, res, next) => {
        Dishes.findByIdAndUpdate(req.params.dishId, {
            $set: req.body
        }, { new: true })
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish);//send this back to the client.
            }, (err) => next(err)) //second parameter brings what happens when the promise is not fulfilled.
            .catch((err) => next(err)); //pass the error to the overall error handler.
    })
    .delete((req, res, next) => {
        Dishes.findByIdAndRemove(req.params.dishId)
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err)) //second parameter brings what happens when the promise is not fulfilled.
            .catch((err) => next(err));
    });
module.exports = dishRouter;