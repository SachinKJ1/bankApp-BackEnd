// define node and mongodb connectivity

// import mongoose
const mongoose = require("mongoose");

// to get connection string from .env file : process.env
const connectionString = process.env.DATABASE;

// Connect node app with mongodb using connection string with the help of mongoose
mongoose
  .connect(connectionString, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("MongoDb atlas Connected Succesfully");
  }).catch(()=>{
    console.log('MongoDb Connection Error');
  })
