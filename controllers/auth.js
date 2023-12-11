const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const crypto = require('crypto');

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
   service : "Gmail",
   auth : {
        user : "superkingsuniverse1@gmail.com",
        pass : "xnnlixaxjkikxbeb"
   }
})

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

exports.getReset = (req, res, next) => {
  res.render("auth/reset", {
      pageTitle: "Reset Password",
      path: "/login",
  });
};

exports.getNewPassword = async (req, res, next) => {

  const token = req.params.token ;
  const user = await User.findOne({
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() },
  });

  if(!user){
      return res.redirect("/reset");
  }
  res.render("auth/new-password", {
      pageTitle: "Update Password",
      path: "/login",
      token: token,
      userId: user._id,
  });
}



exports.postSignup = async (req, res, next) => {
   const { name ,email, password } = req.body ;
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
        const user = await User.create({name, email, password : hasedPassword, role : "admin" });
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
        return res.redirect("/api/login");

    }
   } catch (err) {
    //  res.status(500).json({ message : "unable to send email "});
    return res.redirect("/api/signup");

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

exports.postReset = async (req, res, next) => {
  const email = req.body.email ;

  let user = await User.findOne({ email: email });
  if(!user) {
    return res.status(500).json({ message : "user not found"});
  }

  //generate a random token 
  crypto.randomBytes(32, async (err, buffer) => {
     if(err) {
      return res.status(500).json({ message : "Internal Server Error"});
     }
     const token = buffer.toString("hex");

     //set the token expiration

     user.resetToken = token ;
     user.resetTokenExpiration = Date.now() + 36000000 ;

     try {
      await user.save();
      await transporter.sendMail({
        from : "superkingsuniverse1@gmail.com",
        to : email,
        subject : "Reset Password",
        html : `<html><h2>You have requested to reset your password</h2>
        <p>Click on this <a href='${process.env.FRONTEND_URL}set-password?userId=${user._id}&token=${token}'>link</a> to Reset your password.</p>
        </html>`
        
      });
      res.status(200).json({ message : "Reset Password mail send successfully!" });
     } catch (err) {
      return res.status(500).json({ message : "Internal Server Error"});

     }
  })

}

exports.postNewPassword = async (req, res, next) => {
  const { password, token, userId } = req.body;
  const user = await User.findOne({
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() },
  });
  if (!user) {
     return res.status(409).json({ message : "Session Timeout"});

  }
  let hashedPassword;
  try {
      hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    return res.status(500).json({ message : "Internal Server Error"});
  }

  try {
      await User.findByIdAndUpdate(userId, {
          password: hashedPassword,
          resetToken: null,
          resetTokenExpiration: null,
      });
      res.status(200).json({ message : "Password updated successfully" });
  } catch (err) {
    return res.status(500).json({ message : "Internal Server Error"});
  }
}

exports.postLogout = (req, res,next) => {
  req.session.destroy(() => {
          res.redirect("/api/login");
      });
}
