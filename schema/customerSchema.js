const mongoose=require('mongoose')
const validator=require('validator')


//schema to visualize how a database should be structured
const customerSchema=new mongoose.Schema({
    firstName:{type:String,required:true},
    middleName:{type:String},
    lastName:{type:String,required:true},
    email:{type:String,required:true,
    validate:(value)=>validator.isEmail(value)},
    password:{type:"string",required:true},
    mobile:{type:String,required:true},
    address:{type:String,required:true},
    city:{type:String,required:true},
    state:{type:String,required:true},
    pincode:{type:String,required:true},
    status:{type:String,default:"Customer"},
    createdAt:{type:Date,default:Date.now()}
},{versionKey:false,collection:'Customers'})

//model provides an interface to the database for creating, querying, updating, deleting records, etc.
const customerModel=mongoose.model('Customers',customerSchema)
module.exports={customerModel}
