// import mongoose
const mongoose = require("mongoose");

// use mongoose to define schema and collection

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    requred: true,
  },
  password: {
    type: String,
    requred: true,
  },
  acno: {
    type: String,
    requred: true,
    unique: true,
  },
  balance: {
    type: Number,
    requred: true,
  },
  transactions: {
    type: Array,
    requred: true,
  },
});

// create a model, collection to store documents as a given schema
const users = mongoose.model("users", userSchema);

// export the model
module.exports = users;
