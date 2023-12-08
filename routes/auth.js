const express = require('express') ;

const {postSignup, postLogin ,postReset} = require("../controllers/auth");

const router = express.Router();

router.post("/signup", postSignup);
router.post("/login", postLogin);
router.post("/reset", postReset);


module.exports = router;