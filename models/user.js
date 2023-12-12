const mongoose = require('mongoose') ;
const Schema = mongoose.Schema ;

const userSchema = new Schema({
   name : {
    type : 'string',
    required : false,
   },
   email : {
    type : 'string',
    required : true,
    unique : true,
   },
   password : {
    type : 'string',
    required : true,
   },
   role : {
    type : 'string',
    required : false,
   }, resetToken: String,
   resetTokenExpiration: Date,
},
   { timestamps: true }
);
module.exports = mongoose.model('User', userSchema) ;