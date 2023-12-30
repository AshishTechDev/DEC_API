const express = require('express') ;

const {getNewSignup,  postSignup, postLogin ,postReset, getNewPassword, postNewPassword, postLogout} = require("../controllers/auth");

const router = express.Router();

router.post("/signup", postSignup);
router.post("/login", postLogin);

router.post("/logout", postLogout);

router.post("/reset", postReset);
// router.get("/newPassword", postnewReset);
router.get("/reset/:token", getNewPassword);
router.post("/new-password", postNewPassword);
router.get("/newSignup", getNewSignup);



module.exports = router;