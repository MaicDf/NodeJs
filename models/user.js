var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose=require('passport-local-mongoose');//creating an schema with passport

var User = new Schema({
    admin: {
        type: Boolean,
        default: false
    }
});

User.plugin(passportLocalMongoose); //-> adds user and pasword properties to the Schema 
module.exports = mongoose.model('User',User);