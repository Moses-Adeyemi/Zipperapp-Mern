const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');

// Middleware to protect routes
exports.protect = async (req, res, next) => {
  let token;

  // Check if authorization header exists and starts with 'Bearer'
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    // Extract the token from the authorization header
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    // If no token is found, return an error response
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user based on the decoded token's id
    const user = await User.findById(decoded.id);

    if (!user) {
      // If no user is found with the decoded id, return an error response
      return next(new ErrorResponse('No user found with this id', 404));
    }

    // Set the user object on the request for further processing
    req.user = user;

    next();
  } catch (error) {
    // If the token is invalid or expired, return an error response
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
};
