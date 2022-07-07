// have the access to the response & response cycle 
// check if there is token in the header
const jwt = require('jsonwebtoken');
const config = require('config');

// next: move on to the next middleware
module.exports = function (req, res, next) {
  // Get token from header req.header("key to the token inside header")
  const token = req.header('x-auth-token');
  // pertain to protected routes
  // Check if no token exist
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    // pullout the payload
    const decoded = jwt.verify(token, config.get('jwtSecret'));
    // we only need the user id(decoded.user)
    // so we have access to inside the route

    req.user = decoded.user;
    // move on
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
