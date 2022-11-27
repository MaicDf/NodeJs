const mongoose = require('mongoose'); //npm install mongoose --save
const Schema = mongoose.Schema; //with mongoose we do have to initialize our server-> mongod command

//DOCUMENT Schema, leader schema becomes the collection
const leaderSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true /* All documents should have name, and should be unique */
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    designation: {
        type: String,
        default: '' /* we can also put a default value */
    },
    abbr: {
        type: String,
        required: true
    },
    featured: {
        type: Boolean,
        default:false 
    }     
}, { //aditional properties
    timestamps: true /* Creates the time stamps in all the documents "created at" and "updated at" */
});

var Leaders = mongoose.model('Leader', leaderSchema);

module.exports = Leaders;