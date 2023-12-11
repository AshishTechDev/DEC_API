const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser') ;
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

const MONGODB_URI = `mongodb+srv://${process.env.DB_USERNAME}:${encodeURIComponent(process.env.DB_PASSWORD)}@cluster0.27sicvx.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority` ;

const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions",
});

const User = require("./models/user");
const authRoutes = require("./routes/auth");
const homeRoutes = require("./routes/home");
  
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("public"));




app.use(session({ 
  secret: 'It is a secret key', 
  resave: false, 
  saveUninitialized: false,
  store: store,
})
);



app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn ;
  res.locals.isAdmin = req.session.role == 'admin' ? true : false;
  if(!req.session.isLoggedIn) {
   return next();
  }
   User.findById(req.session.user)
   .then((user) => {
     req.user = user;
     next();
    })
    .catch((err) => console.log(err));
  });
  
  app.use("/api", authRoutes);
  app.use(homeRoutes);

  
  mongoose.connect(MONGODB_URI).then(()=> {
    app.listen(process.env.PORT, ()=>{
    console.log(`listening on port at ${process.env.PORT}`);
  })
}).catch((err)=> console.log(err));
