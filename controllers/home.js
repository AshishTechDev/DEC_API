const Post = require('../models/post');
const User = require('../models/user');
exports.getIndex = async (req, res, next) => {
  try {
    const peoples = await User.find();
    const posts = await Post.find().populate("userId");
    
    const userId = req.user ? req.user._id : null ;
    res.render("home/home", {
      pageTitle: "home",
      path: "/",
      posts : posts.reverse(),
      userId : userId,
      peoples : peoples,
    });
  } catch (err) {
    console.log(err.message);
  }
};