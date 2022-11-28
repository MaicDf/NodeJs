//here is where all is managed and started

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session= require('express-session');
var fileStore = require ('session-file-store')(session); 

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
  resave:false,
  store: new fileStore()
}));

//here we should do authentication here, before the requests 
function auth(req, res, next) { //i assume app.use always passes these 3 parameters to the functions.
  console.log(req.session);
  if (!req.session.user) { //si no hay cookies o  session, pedir datos

    var authHeader = req.headers.authorization;
    if (!authHeader) { //null?
      var err = new Error('You are not authenticated');
      res.setHeader('WWW-Authenticate', 'Basic');//THIS SENDS BACK THE CHALLENGE
      err.status = 401;
      next(err);
    } else {
      try {
        var auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':'); //authHeader.splt separa el string en el espacio y otro para separar contraseña y usuario
        //Buffer objects are used to represent a fixed-length sequence of bytes. 

        /*los buffers son espacios de almacenamiento de manera temporal, memoria intermedia,hardware o software
         Evitar degradar el tiempo de procesamiento de información, la info se va poniendo en una cola */

        var username = auth[0];
        var password = auth[1];
      }
      catch (err) { //err is just an identifier to hold the caught exception
        console.log("i Entered to this error11")
      }

      //default user
      if (username === 'admin' && password === 'password')/* The strict equality (===) operator checks whether its two operands are equal, returning a Boolean result. Unlike the equality operator, the strict equality operator always considers operands of different types to be different. */ {
        
        //res.cookie('user','admin',{signed:true}); ///name of the cookie, value, cookie options
        req.session.user='admin';
        next(); //next middleware
      } else {
        var err = new Error('You are not authenticated');//Error is a NodeJS Object
        res.setHeader('WWW-Authenticate', 'Basic');
        err.status = 401;
        next(err);
      }
    }
  }else{
    if(req.session.user=='admin'){ //si ya hay cookies o una express session
      next();
    }else{
      var err = new Error('You are not authenticated');//Error is a NodeJS Object
      err.status = 401;
      next(err); 
    }
  }

}
app.use(auth);

app.use(express.static(path.join(__dirname, 'public')));//enables us to serve data from the public folder

//Handling the http requests  with the specific modules
app.use('/', indexRouter);
app.use('/users', usersRouter); //Ex: Requests to the endpoint /users will be handle by usersRouter express module
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
