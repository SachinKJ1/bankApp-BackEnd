// import
// config : loads .env file contents into process.env
require("dotenv").config();

// import express
const express = require("express");
// import cors

const cors = require("cors");

// import connection.js file
require("./db/connection");

//import router

const router = require("./Routes/router");
// express server
const server = express();

// setup port number for server
const PORT = 3000 || process.env.PORT;

const middleware = require("./Middleware/appMiddleware");
// use cors,json parser in server app. the order matters as shown here

server.use(cors());
server.use(express.json());
// using custom middleware

server.use(middleware.appMiddleware);

// use router in server app. the order matters as shown here
server.use(router);

// to resolve http request using express server
server.get("/", (req, res) => {
  res.send("Bank server started !!!");
});

// Post Method
server.post("/", (req, res) => {
  res.send("Post Method !!!");
});

// Delete Method
server.delete("/", (req, res) => {
  res.send("Delete Method !!!");
});

// run the server  app in a specified port number
// first argument is the port number . we stored it in a variable just above
server.listen(PORT, () => {
  console.log(`Bank server started at port number ${PORT}`);
});
