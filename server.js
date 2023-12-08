const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser') ;

const MONGODB_URI = `mongodb+srv://${process.env.DB_USERNAME}:${encodeURIComponent(process.env.DB_PASSWORD)}@cluster0.27sicvx.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority` ;

const app = express();

app.use(bodyParser.json());
const authRoutes = require("./routes/auth");
app.use("/api", authRoutes);

mongoose.connect(MONGODB_URI).then(()=> {
  app.listen(process.env.PORT, ()=>{
    console.log(`listening on port at ${process.env.PORT}`);
  })
}).catch((err)=> console.log(err));
