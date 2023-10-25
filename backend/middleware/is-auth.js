const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    const error = new Error("Not authenticated.");
    error.statusCode = 401;
    throw error;
  }

  //the token references authHeader and splits on the white-space that comes after 'Bearer ', which is located on the frontend Feed.js file's Authorization header
  const token = authHeader.split(" ")[1];
  let decodedToken;
  try {
    //token gets decoded with the use of a signature to verify if the user is truly authenticated before they can access secured requests in the app
    decodedToken = jwt.verify(token, "somesupersecretsecret");
  } catch (err) {
    err.statusCode = 500;
    throw err;
  }
  //if the token was not able to be verified
  if (!decodedToken) {
    const error = new Error("Not authenticated.");
    error.statusCode = 401;
    throw error;
  }
  req.userId = decodedToken.userId;
  next();
};
