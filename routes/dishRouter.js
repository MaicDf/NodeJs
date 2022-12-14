const express = require('express');
const bodyParser = require('body-parser');

//conecting to mongoose
const mongoose = require('mongoose');
const Dishes = require('../models/dishes'); //importing the model

//using jwt authentication
const authenticate = require('../authenticate');

//##DECLARING ROUTER
const dishRouter = express.Router();

dishRouter.use(bodyParser.json()); //this parses the body of the requests into JSON

//##takes end point as a paramaeter
dishRouter.route('') //here the path put in index is extended 
    //##Selecting the endpoint##

    //Just for get request, this will be executed right after app.all (modified >res<) when there is a get request.
    .get((req, res, next) => {
        //#no auth restriction
        Dishes.find({})
            .then((dishes) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dishes);//send this back to the client.
            }, (err) => next(err)) //second parameter brings what happens when the promise is not fulfilled.
            .catch((err) => next(err)); //pass the error to the overall error handler.
        //end of the response
    })

    /*Model.create() method of the Mongoose API is used to create 
    single or many documents in the collection. Mongoose by 
    default triggers save() internally when we use the create() method on any model. */
    .post(authenticate.verifyUser,(req, res, next) => {
        //here we verify user authenticity first
        Dishes.create(req.body).
            then((dish) => {
                console.log("Dish Created ", dish);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish); //send this back to the client.
            }, (err) => { console.log("My error: ", err); next(err); }) //second parameter brings what happens when the promise is not fulfilled.
            .catch((err) => { console.log("My error: ", err); next(err); }); //pass the error to the overall error handler.);
    })
    .put(authenticate.verifyUser,(req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /dishes');
    })
    .delete(authenticate.verifyUser,(req, res, next) => {
        Dishes.collection.drop() //accesing to the collection in the model
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
    .post(authenticate.verifyUser,(req, res, next) => {
        res.statusCode = 403;
        res.end('post operation not supported on /dishes/:dishId-> ' + req.params.dishId);
    })

    /* Note that update(), updateMany(), findOneAndUpdate(), etc. do not execute save() middleware. If you need save middleware and full validation,
     first query for the document and then save() it. */
    .put(authenticate.verifyUser,(req, res, next) => {
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
    .delete(authenticate.verifyUser,(req, res, next) => {
        Dishes.findByIdAndRemove(req.params.dishId)
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err)) //second parameter brings what happens when the promise is not fulfilled.
            .catch((err) => next(err));
    });



//##Selecting the endpoint, now for the comments

//mongoose doesn't support a direct way to makes updates to a subdocument

dishRouter.route('/:dishId/comments') //here the path put in index is extended 


    //Just for get request, this will be executed right after app.all (modified >res<) when there is a get request.
    .get((req, res, next) => {
        Dishes.findById(req.params.dishId)
            .then((dish) => {
                if (dish != null) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(dish.comments);//send this back to the client.
                }
                else {
                    err = new Error('Dish' + req.params.dishId + 'not found');
                    err.status = 404; //not found
                    return next(err); //return error for the general error handler
                }

            }, (err) => next(err)) //second parameter brings what happens when the promise is not fulfilled.
            .catch((err) => next(err)); //pass the error to the overall error handler.
        //end of the response
    })
    .post(authenticate.verifyUser,(req, res, next) => {
        Dishes.findById(req.params.dishId)
            .then((dish) => {
                if (dish != null) {
                    dish.comments.push(req.body); //the body contains what is going to be pushed.
                    dish.save() //needed when we do modifications in subdocuments.
                        .then((dish) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(dish.comments);//send this back to the client.
                        }, (err) => next(err));
                }
                else {
                    err = new Error('Dish' + req.params.dishId + 'not found');
                    err.status = 404; //not found
                    return next(err); //return error for the general error handler
                }
            }, (err) => next(err)) //second parameter brings what happens when the promise is not fulfilled.
            .catch((err) => next(err)); //pass the error to the overall error handler
    })
    .put(authenticate.verifyUser,(req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /dishes/' + req.params.dishId + 'comments');
    })
    .delete(authenticate.verifyUser,(req, res, next) => {
        Dishes.findById(req.params.dishId)
            .then(dish => {
                if (dish != null) {
                    for (var i = (dish.comments.length - 1); i >= 0; i--) {
                        dish.comments.id(dish.comments[i]._id).remove(); //accesing the sub document
                    }
                    dish.save() //needed when we do modifications in subdocuments.
                        .then((dish) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(dish);//send this back to the client.
                        }, (err) => next(err));
                }
                else {
                    err = new Error('Dish' + req.params.dishId + 'not found');
                    err.status = 404; //not found
                    return next(err); //return error for the general error handler
                }
            }, (err) => next(err)) //second parameter brings what happens when the promise is not fulfilled.
            .catch((err) => {
                console.log("Here is the error", err);
                next(err)

            });
    }); //all of them are chained together


//###PARAMETERS, retrvieng for the param
dishRouter.route('/:dishId/comments/:commentId') //here the path put in index is extended 
    .get((req, res, next) => {
        Dishes.findById(req.params.dishId)
            .then((dish) => {
                //first making sure that both, dish and comment on the dish exist.
                if (dish != null && dish.comments.id(req.params.commentId) != null) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(dish.comments.id(req.params.commentId));//send this back to the client.
                }
                else if (dish == null) {
                    err = new Error('Dish' + req.params.dishId + 'not found');
                    err.status = 404; //not found
                    return next(err); //return error for the general error handler
                } else {
                    err = new Error('Comment ' + req.params.commentId + 'not found');
                    err.status = 404; //not found
                    return next(err); //return error for the general error handler
                }

            }, (err) => next(err)) //second parameter brings what happens when the promise is not fulfilled.
            .catch((err) => next(err)); //pass the error to the overall error handler.
    })
    .post(authenticate.verifyUser,(req, res, next) => {
        res.statusCode = 403;
        res.end('post operation not supported on /dishes/:dishId-> ' + req.params.dishId + '/comments/' + req.params.commentId);
    })

    /* Note that update(), updateMany(), findOneAndUpdate(), etc. do not execute save() middleware. If you need save middleware and full validation,
    first query for the document and then save() it. */
    .put(authenticate.verifyUser,(req, res, next) => {
        Dishes.findById(req.params.dishId)
            .then((dish) => {
                //first making sure that both, dish and comment on the dish exist.
                if (dish != null && dish.comments.id(req.params.commentId) != null) {

                    //don't allow to change the author
                    if (req.body.rating) {
                        dish.comments.id(req.params.commentId).rating = req.body.rating;
                    }
                    if (req.body.comment) {
                        dish.comments.id(req.params.commentId).comment = req.body.comment;

                    }
                    dish.save() //needed when we do modifications in subdocuments.
                        .then((dish) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(dish.comments);//send this back to the client.
                        }, (err) => next(err));
                }
                else if (dish == null) {
                    err = new Error('Dish' + req.params.dishId + 'not found');
                    err.status = 404; //not found
                    return next(err); //return error for the general error handler
                } else {
                    err = new Error('Comment ' + req.params.commentId + 'not found');
                    err.status = 404; //not found
                    return next(err); //return error for the general error handler
                }

            }, (err) => next(err)) //second parameter brings what happens when the promise is not fulfilled.
            .catch((err) => next(err)); //pass the error to the overall error handler.
    })
    .delete(authenticate.verifyUser,(req, res, next) => {
        Dishes.findById(req.params.dishId)
            .then(dish => {
                if (dish != null && dish.comments.id(req.params.commentId) != null) {
                    dish.comments.id(req.params.commentId).remove();
                    dish.save()
                        .then((dish) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(dish);//send this back to the client.
                        }, (err) => next(err));
                }
                else if (dish == null) {
                    err = new Error('Dish' + req.params.dishId + 'not found');
                    err.status = 404; //not found
                    return next(err); //return error for the general error handler
                } else {
                    err = new Error('Comment ' + req.params.commentId + 'not found');
                    err.status = 404; //not found
                    return next(err); //return error for the general error handler
                }
            }, (err) => next(err)) //second parameter brings what happens when the promise is not fulfilled.
            .catch((err) => next(err));
    });

module.exports = dishRouter;