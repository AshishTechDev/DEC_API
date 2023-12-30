const mongoose = require('mongoose');
const Schema = mongoose.Schema ;

const postSchema = new Schema({
    title : {
        type : 'String',
        required : true,
    },
    imageUrl : {
        type : 'String',
        required : false,
    },
    comment : {
        type : 'String',
        required : false,
    }, 
    
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref: "User",
        required : true,
    },
},
    { timestamps : true }
);

 module.exports = mongoose.model('post', postSchema);