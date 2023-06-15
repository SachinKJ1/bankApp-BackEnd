// import model
const { response } = require("express");
const users = require("../db/Models/userSchema");

// import json web token
const jwt = require("jsonwebtoken");

// define and export logic to resolve different http client requests

// register
exports.register = async (req, res) => {
  // register logic
  console.log(req.body);

  // get data send from fornt end
  const { username, acno, password } = req.body;

  if (!username || !acno || !password) {
    res.status(403).json("Please enter all fields");
  }

  // check user is existing or not existing
  try {
    const preuser = await users.findOne({ acno });
    if (preuser) {
      // 406 - not acceptable
      res.status(406).json("User already registered");
    } else {
      // add user to db
      // the order is important. same as the schema we created in userSchema.js file
      const newUser = new users({
        username,
        password,
        acno,
        balance: 5000,
        transactions: [],
      });
      // to save new user to mongodb
      await newUser.save();
      res.status(200).json(newUser);
    }
  } catch (error) {
    res.status(401).json(error);
  }

  //
};

// login
exports.login = async (req, res) => {
  // get req body

  const { acno, password } = req.body;
  try {
    // check acno and password in database
    const preuser = await users.findOne({ acno, password });
    // check preuse is defined or not
    if (preuser) {
      // generate token using jwt
      const token = jwt.sign({ loginAcno: acno }, "supersecretkey12345");
      // send token to frontend
      res.status(200).json({ preuser, token });
    } else {
      res.status(404).json("Invalid Credentials");
    }
  } catch (error) {
    res.status(401).json(error);
  }
};

// getBalance
exports.getBalance = async (req, res) => {
  // get req body
  const acno = req.params.acno;
  try {
    // check acno and password in database
    const preuser = await users.findOne({ acno });
    // check preuse is defined or not
    if (preuser) {
      res.status(200).json(preuser.balance);
    } else {
      res.status(404).json("Invalid Account Number");
    }
  } catch (error) {
    res.status(401).json(error);
  }
};

// Fund Transfer
exports.fundTransfer = async (req, res) => {
  console.log("inside fund transfer");
  try {
    const { creditAcno, creditAmount, profilePswd } = req.body;
    const { debitAcno } = req;
    // check debit acno and password is available in mongoDB
    const debitUserDetails = await users.findOne({
      acno: debitAcno,
      password: profilePswd,
    });
    // get credit account details from mongoDB
    const creditUserDetails = await users.findOne({ acno: creditAcno });
    console.log(creditUserDetails);
    console.log("----------------------------------------------------");
    console.log(creditAcno, debitAcno);
    // check if accounts are different so that self transfer is not a thing
    if (debitAcno == creditAcno) {
      return res
        .status(406)
        .json("Operation Denied! Self Transactions are not allowed");
    }

    if (debitUserDetails && creditUserDetails) {
      // check sufficient balance and perform transfer if balance is greater than amount and show an error message for else case
      if (debitUserDetails.balance >= creditAmount) {
        // decrease amount from debit account &  increase amount from credit account
        debitUserDetails.balance -= creditAmount;
        creditUserDetails.balance += creditAmount;
        // save details to transaction array for both accounts
        debitUserDetails.transactions.push({
          transactions_type: "DEBIT",
          amount: creditAmount,
          fromAcno: debitAcno,
          toAcno: creditAcno,
        });
        creditUserDetails.transactions.push({
          transactions_type: "CREDIT",
          amount: creditAmount,
          fromAcno: debitAcno,
          toAcno: creditAcno,
        });
        // to save changes in mongoDB
        await debitUserDetails.save();
        await creditUserDetails.save();
        res.status(200).json("transfer successfull");
      }
    } else {
      res.status(406).json("Invalid Credit or debit details");
    }
  } catch (error) {
    res.status(401).json(error);
  }
};

exports.getTransactions = async (req, res) => {
  try {
    const acno = req.debitAcno;
    console.log(acno);
    const user = await users.findOne({ acno: acno });
    res.status(200).json(user.transactions);
  } catch (error) {
    res.status(404).json("transaction not found");
  }
};

exports.deleteAccount = async (req, res) => {
  // get acno from request
  let acno = req.debitAcno;
  // remove the account from database
  try {
    await users.deleteOne({ acno });
    res.status(200).json("Removed Succesfully");
  } catch (error) {
    res.status(401).json("something went wrong");
  }
};
