const express = require('express') ;

const {addPost, getMyPosts, editMyPosts , updatePost, deletePost, editProfile, updateProfile} = require("../controllers/user");

const router = express.Router();
const upload = require("../middlewares/file-upload");
const Profileupload = require("../middlewares/profile-upload");

var multipleUpload = Profileupload.fields([{ name : "profileBanner"}, { name : "profilePic"}]);

router.post("/addpost", upload.single("imageUrl") , addPost);
router.get("/mypost/:id", editMyPosts);
router.get("/mypost",getMyPosts);
router.post("/updatepost",upload.single("imageUrl"), updatePost);
router.get("/deletepost/:id", deletePost);
router.get("/editprofile/:id", editProfile);
router.post("/updateprofile", multipleUpload , updateProfile);


module.exports = router;