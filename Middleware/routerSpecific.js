// logic for check logging
// import jsonwebtoken from 'jsonwebtoken
const jwt = require("jsonwebtoken");
const logMiddleware = (req, res, next) => {
  console.log("router specific middleware");
  // get token
  const token = req.headers["access-token"];

  try {
    // verifying the token and taking out the logged in acno no
    const { loginAcno } = jwt.verify(token, "supersecretkey12345");
    console.log(loginAcno);
    // passing loginAcno as properties value to access it in the route handler
    req.debitAcno = loginAcno;
    next();
  } catch {
    res.status(401).json({ message: "Please Log In" });
  }
};

module.exports = {
  logMiddleware,
};
