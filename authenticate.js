var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy; //here we save the strategies for authentication
var User = require('./models/user');

 //JWT strategy for our module
 var JwtStrategy = require('passport-jwt').Strategy;
 var ExtractJwt = require('passport-jwt').ExtractJwt;
 var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
 
 var config = require('./config.js');

//authenticate provides the user authentication function, comes with passportLocalMongoose
exports.local = passport.use(new LocalStrategy(User.authenticate()));
//also come in the plugin.
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//to create the token, "user" is the payload used to create the webtoken
exports.getToken = function(user) {//lo que sale d e este modulo
    return jwt.sign(user, config.secretKey,//helps to create the JWT
        {expiresIn: 3600});
};

var opts = {};
//extracting jason web token
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken(); //de donde se extrae el header.
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(new JwtStrategy(opts, //configuring passport strategy
    (jwt_payload, done) => {//verification function
        console.log("JWT payload: ", jwt_payload);
        User.findOne({ _id: jwt_payload._id }, (err, user) => { //mongoose function
            if (err) {
                return done(err, false);
            } else if (user) {
                return done(null, user);
            } else {
                return done(null, false);
            } //done is a funcition that is used to do the call back
        });
    }));


//for verifying user atuhentinticity, stop execution to verify
exports.verifyUser = passport.authenticate('jwt', { session: false }); //no creamos sesiones solo JWT