const mongoose = require('mongoose') ;
const Schema = mongoose.Schema ;

const userSchema = new Schema({
   name : {
    type : 'String',
    required : false,
   },
   email : {
    type : 'String',
    required : true,
    unique : true,
   },
   password : {
    type : 'String',
    required : true,
   },
   profileBanner : {
      type : 'String',
      required : false,
   },
   profilePic : {
      type : 'String',
      required : false,
   },
   description : {
      type : 'String',
      required : false,
   },
   role : {
    type : 'String',
    required : false,
   },
   birth : {
      type : 'String',
      format : 'dd-MMM-yyyy',
      required : false,
   },
   website : {
      type : 'String',
      required : false,
   },
   Post : [
      {
         PostId : {
            type : Schema.Types.ObjectId,
            ref: "post",
            required : true,
         },
      },
   ],
   resetToken: String,
   resetTokenExpiration: Date,
},
   { timestamps: true }
);

userSchema.methods.addToPosts = function (postId) {
   const updatedPostItems = [...this.Post];
     updatedPostItems.push({ PostId: postId});
   this.Post = updatedPostItems;
   return this.save();
 };

 userSchema.methods.removeFromPost = function (postId) {
   
   const updatedpost = this.Post.filter((b) => {
     return b.PostId.toString() !== postId;
   });
   this.Post = updatedpost;
   return this.save();
 };

module.exports = mongoose.model('User', userSchema) ;