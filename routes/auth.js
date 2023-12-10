const express = require('express') ;

const {postSignup, postLogin ,postReset, updatePassword} = require("../controllers/auth");

const router = express.Router();

router.post("/signup", postSignup);
router.post("/login", postLogin);
router.post("/reset", postReset);
router.patch("/update-password", updatePassword);




module.exports = router;