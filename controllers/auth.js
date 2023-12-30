const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const crypto = require('crypto');

const nodemailer = require("nodemailer");
const { log } = require('console');

const transporter = nodemailer.createTransport({
   service : "Gmail",
   auth : {
        user : "superkingsuniverse1@gmail.com",
        pass : "xnnlixaxjkikxbeb"
   }
})

exports.getNewSignup = (req, res, next) => {
  res.render("auth/signupnew", {
    path : "/newsignup",
  })
}

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
      pageTitle : "Login",
      path : "/login",
});
};

exports.getSignup = (req, res, next) =>{
  res.render("auth/signup", {
      pageTitle : "Sign Up",
      path : "/signup",
  });
};





exports.postSignup = async (req, res, next) => {
   const { name , email, password } = req.body ;
   const user = await User.findOne({ email : email } );
   if(user) {
      // res.status(500).json({ message : "user already exists"});
      return res.redirect("/api/login");

   }
   let hasedPassword ;
   try {
    hasedPassword = await bcrypt.hash(password, 12);
   }catch (err) {
       console.log("unable to encrypt password");
      //  return res.status(500).json({ message : "unable to encrypt password"});
   }

   try {
     const users = await User.find() ;
     if(users.length == 0){
        const user = await User.create({name, email , password : hasedPassword, role : "admin" });
     } else {
      const user = await User.create({ name, email , password : hasedPassword, role : "user" });
     }
   } catch (err) {
      console.log("unable to create ");
      //  res.status(500).json({ message : "unable to create account "});
      return res.redirect("/api/login");

   }

   try {
    const mailSent = await transporter.sendMail({
      from : "abhandari586@gmail.com",
      to : email,
      subject : "Account created successfully",
      html : `<div><h2>Your Account is created Successfully</h2></div>`,
    });
    if(mailSent) {
        // res.status(200).json({ message : "Your Account is created Successfully !"});
        return res.redirect("/api/newsignup");

    }
   } catch (err) {
    //  res.status(500).json({ message : "unable to send email "});
    return res.redirect("/api/newsignup");

  }

};

exports.postLogin = async (req, res, next) => {
  const { email, password} = req.body ;
  console.log(email,password) ;
  const user = await User.findOne({ email : email } );
  if(!user) {
    return res.status(500).json({ message : "user not found"});
  }

  try {
    const doMatches = await bcrypt.compare(password, user.password);
    if(doMatches) {
              req.isLoggedIn = true;
      req.session.isLoggedIn = true;
        req.session.user = user._id;
        req.session.role = user.role;
        req.session.save(() => {
         return res.redirect("/");
        });
      // res.status(200).json({ token, role: user.role});
    } else {
      return res.status(500).json({ message: "password mismatch"});
    }
  } catch (err) {
    return res.status(500).json({ message: "password mismatch"});
  }
};

// exports.postnewReset = async (req, res, next) => {
//   res.render("auth/resetpassword", {
//     pageTitle: "Update Password",
//     path: "/reset",
// });
// }

exports.postReset = async (req, res, next) => {
  console.log("user") ;
  const email = req.body.email ;
  console.log(email);
  //1) Whether the email exists or not
  let user = await  User.findOne({ email: email });
  // console.log(user.email) ;
  if(!user){
      return res.redirect("/reset");
  }
  //2) Generate a random token
  crypto.randomBytes(32, (err, buffer)=>{
      if(err){
          console.log(err);
          return;
      }
  const token = buffer.toString("hex");
  //3) Set the token and expiration in user instance
  user.resetToken = token;
  user.resetTokenExpiration = Date.now() + 3600000;
  user
  .save()
  .then(() => {
      //4) Send mail to the user along with token
      return transporter.sendMail({
          from: "superkingsuniverse1@gmail.con",
          to: email,
          subject: "Reset Password",
          html: `<h1>Click on the link below to reset your password</h1>
          <a href="http://localhost:4000/api/reset/${token}">Reset Password</a>`,
      });
  }) 
  .then(() => {
      res.redirect("/api/newSignup");
  })
  .catch((err) => console.log(err));
});
};

exports.getNewPassword = async (req, res, next) => {

  const token = req.params.token ;
  console.log(token);
  const user = await User.findOne({
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() },
  });

  if(!user){
      return res.redirect("/api/newSignup");
  }
  res.render("auth/resetpassword", {
      pageTitle: "Update Password",
      path: "/reset",
      token: token,
      userId : user._id,
  });
}

exports.postNewPassword = async (req, res, next) => {
  const { password, token, userId } = req.body;
  console.log(password, token, userId);
  const user = await User.findOne({
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() },
  });
  if (!user) {
     return res.redirect("/api/newSignup")

  }
  let hashedPassword;
  try {
      hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    return next(err) ;
  }

  try {
      await User.findByIdAndUpdate(userId, {
          password: hashedPassword,
          resetToken: null,
          resetTokenExpiration: null,
      });
      // res.status(200).json({ message : "Password updated successfully" });
      res.redirect("/api/newSignup");
  } catch (err) {
    return res.status(500).json({ message : "Internal Server Error"});
  }
}

exports.postLogout = (req, res,next) => {
  req.session.destroy(() => {
          res.redirect("/");
      });
}
