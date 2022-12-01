//here is where all is managed and started

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var fileStore = require('session-file-store')(session);
var passport = require('passport');
var authenticate = require('./authenticate');

//Endpoints, Http handling requests through this Routers
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dishRouter = require('./routes/dishRouter');
var leaderRouter = require('./routes/leaderRouter');
var promotionRouter = require('./routes/promotionRouter');

//Conecting to the data base
const mongoose = require('mongoose');
const Dishes = require('./models/dishes'); //model exported
const Promotions = require('./models/promotions');
const Leaders = require('./models/leaders');
const url = 'mongodb://localhost:27017/conFusion';
const connect = mongoose.connect(url);

connect.then(() => {
  console.log('Connected correctly to server')
}).catch(err => {
  console.log("General error in moongose module: ", err);
});

/*Each one of the app.use is a middleware, next is used
for specifiying that the param is going to be handled by the
next middleware.
The middleware executes in the order written
*/
//Express
var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// we use cooies here
//app.use(cookieParser('12345-67890-09876-54321')); //cookie signed

app.use(session({ //setting up a session
  name: 'session-id',
  secret: '12345-67890-09876-54321',
  saveUninitialized: false,
  resave: false,
  store: new fileStore()
}));

app.use(passport.initialize());
app.use(passport.session()); //serialize password and serialize user will be stored in a passport session(express sesion)

//here we should do authentication here, before the requests 
//only can access to these two before the authentication
app.use('/', indexRouter);
app.use('/users', usersRouter); //Ex: Requests to the endpoint /users will be handle by usersRouter express module


function auth(req, res, next) {
  console.log(req.session);

  if (!req.user) { //if req.user is not pressent the authentication wasnt succesful, otherwise it was successful
    var err = new Error('You are not authenticated!');
    err.status = 403;
    return next(err);
  }
  else {
  //  if (req.session.user === 'authenticated') {
      next(); //with passport, we have already checked if it is authenticated
    //}
    /*else {
      var err = new Error('You are not authenticated!');
      err.status = 403;
      return next(err);
    }*/
  }
}

app.use(auth);

app.use(express.static(path.join(__dirname, 'public')));//enables us to serve data from the public folder

//Handling the http requests  with the specific modules
app.use('/dishes', dishRouter);
app.use('/promotions', promotionRouter);
app.use('/leaders', leaderRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  console.log("i have entered here!!! Overall error", err);
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
