// define app sepecific middleware

const appMiddleware = (req, res, next) => {
  console.log("Application specific middleware");
  next();
};

// exports multiple with module.exports. we previously used module.export = appMiddleware with this only one thing con be exported

module.exports = {
  appMiddleware,
};
