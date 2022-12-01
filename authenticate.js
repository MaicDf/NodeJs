var passport=require('passport');
var LocalStrategy = require('passport-local').Strategy; //here we save the strategies for authentication
var User=require('./models/user');

//authenticate provides the user authentication function, comes with passportLocalMongoose
exports.local=passport.use(new LocalStrategy(User.authenticate())); 
//also come in the plugin.
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());