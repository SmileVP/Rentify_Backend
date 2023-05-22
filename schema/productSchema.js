const mongoose = require ('mongoose')

//schema to visualize how a database should be structured
const productSchema = new mongoose.Schema({
    category:{
        type: String, require: true
    },
    imgurl:{
        type: String, require: true
    },
    name: {
        type: String, require: true
    },
    description: {
        type: String, require: true
    },
    price: {
        type: String, require: true,
    },
    createdAt: {
        type: Date, default: Date.now()
    }
}, { versionKey: false, collection: 'products' })

//model provides an interface to the database for creating, querying, updating, deleting records, etc.
const ProductModel = mongoose.model('products', productSchema)//
module.exports = { ProductModel }