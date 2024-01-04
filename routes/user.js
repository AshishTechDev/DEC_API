const express = require('express') ;

const isAuth = require("../middlewares/is-Auth");


const {addPost, getMyPosts, editMyPosts , updatePost, deletePost, editProfile, updateProfile} = require("../controllers/user");

const router = express.Router();
const upload = require("../middlewares/file-upload");
const Profileupload = require("../middlewares/profile-upload");

var multipleUpload = Profileupload.fields([{ name : "profileBanner"}, { name : "profilePic"}]);

router.post("/addpost",isAuth, upload.single("imageUrl") , addPost);
router.get("/mypost/:id",isAuth, editMyPosts);
router.get("/mypost",isAuth,getMyPosts);
router.post("/updatepost",isAuth,upload.single("imageUrl"), updatePost);
router.get("/deletepost/:id",isAuth, deletePost);
router.get("/editprofile/:id",isAuth, editProfile);
router.post("/updateprofile",isAuth, multipleUpload , updateProfile);


module.exports = router;