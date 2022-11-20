//here is where all is managed and started

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//Endpoints, Http handling requests through this Routers
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dishRouter = require('./routes/dishRouter');
var leaderRouter = require('./routes/leaderRouter');
var promotionRouter = require('./routes/promotionRouter');

//Conecting to the data base
const mongoose = require('mongoose'); 
const Dishes = require('./models/dishes'); //model exported

const url = 'mongodb://localhost:27017/conFusion';
const connect = mongoose.connect(url);

connect.then(()=>{
  console.log('Connected correctly to server')
}).catch(err=>{
  console.log("General error in moongose module: ",err);
});


//Express
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Handling the http requests  with the specific modules
app.use('/', indexRouter);
app.use('/users', usersRouter); //Ex: Requests to the endpoint /users will be handle by usersRouter express module
app.use('/dishes', dishRouter);
app.use('/promotions',promotionRouter );
app.use('/leaders', leaderRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
