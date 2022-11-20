const mongoose = require('mongoose'); //npm install mongoose --save
const Schema = mongoose.Schema; //with mongoose we do have to initialize our server-> mongod command

//Types importing, by default moongose supports Number, string, boolean, array and some more, but is limited.
require('mongoose-currency').loadType(mongoose);
const Currency=mongoose.Types.Currency;

//SUB DOCUMENT comment Schema
const commentSchema = new Schema({
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    }
}, { //aditional properties
    timestamps: true /* Creates the time stamps in all the documents "created at" and "updated at" */
});


const dishSchema = new Schema({
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
    category: {
        type: String,
        required: true
    },
    label: {
        type: String,
        default: '' /* we can also put a default value */
    },
    price: {
        type: Currency,
        required: true,
        min: 0
    },
    featured: {
        type: Boolean,
        default:false      
    },
    comments: [commentSchema] /* Array of subdocuments inside a document */
}, { //aditional properties
    timestamps: true /* Creates the time stamps in all the documents "created at" and "updated at" */


});

//creating the model given the Schema

var Dishes = mongoose.model('Dish', dishSchema);

module.exports = Dishes;