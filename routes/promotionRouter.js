const express = require('express');
const bodyParser = require('body-parser');

//##DECLARING ROUTER
//conecting to mongoose
const mongoose = require('mongoose');
const Promotions = require('../models/promotions'); //importing the model

const pRouter = express.Router();
//using jwt authentication
const authenticate = require('../authenticate');

pRouter.use(bodyParser.json());

//##takes end point as a paramaeter
pRouter.route('/') //here the path put in index is extended 
    //##Selecting the endpoint##
    .get((req, res, next) => {
        Promotions.find({})
            .then((promotions) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(promotions);//send this back to the client.
            }, (err) => next(err)) //second parameter brings what happens when the promise is not fulfilled.
            .catch((err) => next(err)); //pass the error to the overall error handler.
        //end of the response
    })
    .post(authenticate.verifyUser,(req, res, next) => {
        Promotions.create(req.body).
            then((promotion) => {
                console.log("promotion Created ", promotion);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(promotion); //send this back to the client.
            }, (err) => next(err)) //second parameter brings what happens when the promise is not fulfilled.
            .catch((err) => next(err)); //pass the error to the overall error handler.);
    })
    .put(authenticate.verifyUser,(req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /promotions');
    })
    .delete(authenticate.verifyUser,(req, res, next) => {
        Promotions.collection.drop()
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err)) //second parameter brings what happens when the promise is not fulfilled.
            .catch((err) => next(err));  //pass the error to the overall error handler.);)
        //dangerous operation, must be for priviliged users
    }); //all of them are chained together

//###PARAMETERS, retrvieng for the param
pRouter.route('/:promotionId') //here the path put in index is extended 
    .get((req, res, next) => {
        Promotions.findById(req.params.promotionId)
            .then((promotion) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(promotion);//send this back to the client.
            }, (err) => next(err)) //second parameter brings what happens when the promise is not fulfilled.
            .catch((err) => next(err)); //pass the error to the overall error handler.
        //end of the response
    })
    .post(authenticate.verifyUser,(req, res, next) => {
        res.statusCode = 403;
        res.end('post operation not supported on /promotions/:promotionId-> ' + req.params.promotionId);
    })

    /* Note that update(), updateMany(), findOneAndUpdate(), etc. do not execute save() middleware. If you need save middleware and full validation,
     first query for the document and then save() it. */
    .put(authenticate.verifyUser,(req, res, next) => {
        Promotions.findByIdAndUpdate(req.params.promotionId, {
            $set: req.body
        }, { new: true })
            .then((promotion) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(promotion);//send this back to the client.
            }, (err) => next(err)) //second parameter brings what happens when the promise is not fulfilled.
            .catch((err) => next(err)); //pass the error to the overall error handler.
    })
    .delete(authenticate.verifyUser,(req, res, next) => {
        Promotions.findByIdAndRemove(req.params.promotionId)
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err)) //second parameter brings what happens when the promise is not fulfilled.
            .catch((err) => next(err));
    });

module.exports = pRouter;