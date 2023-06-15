// import express
const express = require("express");

const middleware = require("../Middleware/routerSpecific");
// create routes, using express.Router() class,object
const router = new express.Router();

// import controllers
const userController = require("../controllers/userController");

// definte routes to resolve http requests

// register request
router.post("/employees/register", userController.register);
// login
router.post("/employees/login", userController.login);
// balance enquiry
// also using router specific middleware
router.get(
  "/user/balance/:acno",
  middleware.logMiddleware,
  userController.getBalance
);
// fund transfer
router.post(
  "/user/transfer",
  middleware.logMiddleware,
  userController.fundTransfer
);
// delete account
router.delete(
  "/user/delete",
  middleware.logMiddleware,
  userController.deleteAccount
);

// get transactions
router.get(
  "/user/transactions",
  middleware.logMiddleware,
  userController.getTransactions
);
// export router
module.exports = router;
