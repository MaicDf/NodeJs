var express = require('express');
const bodyParser = require('body-parser');
var User = require('../models/user');

var router = express.Router();
router.use(bodyParser.json());

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', (req, res, next) => { //#####USER SIGN UP
  User.findOne({ username: req.body.username })
    .then((user) => {
      if (user != null) { //significará que el usuario ya existe
        var err = new Error('User' + req.body.username + ' alreadyexist');
        err.status = 403;
        next(err);
      } else {
        return User.create({
          username: req.body.username,
          password: req.body.password
        });
      }
    })
  .then((user) => {//promise chained with the return of the last then
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({ status: 'Registration Succesful', user: user });
  }, (err) => next(err))
    .catch((err) => next(err))

});

router.post('/login', (req, res, next) => { //#####USER LOG IN

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

      //searching for the user in the database
      User.findOne({ username: username })
        .then((user) => {
          if (user == null) {
            var err = new Error('User ' + username + 'doesnt exist');//Error is a NodeJS Object
            err.status = 403;
            next(err);
          } else if (user.password !== password) {
            var err = new Error('your password is incorrect');//Error is a NodeJS Object
            err.status = 403;
            next(err);
          }
          else if (user.username === username && user.password === password) {
            //res.cookie('user','admin',{signed:true}); ///name of the cookie, value, cookie options
            req.session.user = 'authenticated';
            res.statusCode=200;
            res.setHeader('Content-type','text/plain');
            res.end('you are authenticated')
          } 
        })
        .catch((err)=>next(err));
    }
  }else{ //if there is a session
    res.statusCode=200;
    res.setHeader('Content-type','text/plain');
    res.end('You are already authenticated')
  }
});

router.get('/logout',(req, res, next)=>{ //##LOGGING OUT
  if(req.session){
    req.session.destroy(); //eliminar la sesion si existe
    res.clearCookie('session-id'); //asking the client to delete the cookie
    res.redirect('/');
  }else{
    var err= new Error('You are not logged in!');
    err.status =403;
    next(err);
  }
})

module.exports = router;
