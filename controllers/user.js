const { reset } = require('nodemon');
const Post = require('../models/post');
const User = require('../models/user');
const fs = require('fs/promises');



exports.addPost = async (req, res, next) => {
  // console.log(req.file);
  const { title, userId , comment } = req.body ;
  // console.log(req.body) ;
  if(!req.file){
    return res.redirect("/");
  }

try {
  const response = await Post.create({title, imageUrl : req.file.path , comment, userId });
// console.log(response._id);
 await req.user.addToPosts(response._id);
   res.redirect('/');
} catch (err) {
  console.log(err.message);
}
}; 

exports.getMyPosts = async (req, res, next) => {
  try {
    const peoples = await User.find();
    const loginuser = await req.user.populate("Post.PostId");
    const postuserDetails = await req.user ;
    // console.log(postuserDetails);
    // return ;
    const Posts = loginuser.Post;
    res.render("user/myPost", {
      pageTitle: "my Posts",
      title: "MY Posts",
      path: "/mypost",
      posts: Posts,
      user : loginuser,
      peoples: peoples,
      postuserDetails : postuserDetails ,
      banner : loginuser.profileBanner ? true : false,
    });
    } catch(err) {
        console.log(err.message);
    }
  }

exports.editMyPosts = async (req, res, next) => {
  try {
    const user = await req.user.populate("Post.PostId");
    const peoples = await User.find();
    // peoples.forEach(people => {
    //   console.log(people.name) ;
    // });
    const Posts = user.Post;
    const id = req.params.id ;
    const Vost = await Post.findById(id);
    res.render("user/editPost", {
      pageTitle: "my Posts",
      title: "MY Posts",
      path: "/editpost",
      posts: Posts,
      Singlepost: Vost,
      postimg : Vost.imageUrl ? true : false,
      peoples: peoples,
    });
  } catch (err) {
      console.log(err.message);
  }
}

exports.updatePost = async (req, res, next) => {
    const {title, id} = req.body ;
    // console.log(title, id);
    // console.log(req.file);
    // return 

    const post = await Post.findById(id);

    if (req.file) {
      try {
        await fs.unlink(post.imageUrl);
      } catch (err) {
        console.log("error deleting file" + err.message);
      }
    } 
    try{
        await Post.findByIdAndUpdate(id,{
          title,
          imageUrl : req.file ? req.file.path : post.imageUrl
        });
        res.redirect('/mypost');
    } catch (err) {
      console.log(err.message);
    }
}

exports.deletePost = async (req, res, next) => {
  try {
    const id = req.params.id ;
    const Postimg = await Post.findById(id);
    // console.log(Postimg.imageUrl);
    fs.unlink(Postimg.imageUrl, (err) => {
      if (err) {
        return
      } 
    });
    console.log(id, "id for delete post");
    const response = await req.user.removeFromPost(id);
    await Post.findByIdAndDelete(id);
    res.redirect('/mypost');
  } catch (err) {
    console.log(err.message);
  }
}

exports.editProfile = async function (req, res, next) {
  try {
    const id = req.params.id;
    const profile = await User.findById(id) ;
    const peoples = await User.find();
    res.render("user/editProfile", {
      pageTitle: "my Profile",
      title: "MY Profile",
      path: "/editprofile",
      peoples: peoples,
      profile: profile,
      banner : profile.profileBanner ? true : false,
      pic : profile.profilePic ? true : false,
    });
  } catch (e) {
      console.log(e);
  }
}

exports.updateProfile = async function (req, res, next) {
  const {name, description, website, birth, id} = req.body ;
  const profile = await User.findById(id);

    if (req.files.profileBanner) {
      try {
        await fs.unlink(profile.profileBanner);
      } catch (err) {
        console.log("error deleting file" + err.message);
      }
    } 
    if (req.files.profilePic) {
      try {
        await fs.unlink(profile.profilePic);
      } catch (err) {
        console.log("error deleting file" + err.message);
      }
    }

  try {
    console.log("this row");
    await User.findByIdAndUpdate(id, {
        name,
        profileBanner: req.files.profileBanner ? req.files.profileBanner[0].path : profile.profileBanner,
        profilePic : req.files.profilePic ? req.files.profilePic[0].path : profile.profilePic,
         description,
          website,
           birth,
    });
    res.redirect("/mypost");
} catch (e) {

  console.log(e);
}
}