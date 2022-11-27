const mongoose = require('mongoose'); //npm install mongoose --save
const Schema = mongoose.Schema; //with mongoose we do have to initialize our server-> mongod command

//Types importing, by default moongose supports Number, string, boolean, array and some more, but is limited.
require('mongoose-currency').loadType(mongoose);
const Currency=mongoose.Types.Currency;

//DOCUMENT Schema, promotion schema becomes the collection
const promotionSchema = new Schema({
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
    }     
}, { //aditional properties
    timestamps: true /* Creates the time stamps in all the documents "created at" and "updated at" */
});

var Promotions = mongoose.model('Promotion', promotionSchema);

module.exports = Promotions;