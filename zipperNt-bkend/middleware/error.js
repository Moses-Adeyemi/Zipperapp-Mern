const ErrorResponse = require("../utils/errorResponse");

const errorHandler = (err, req, res, next) => {
  let error = { ...err }; // Create a shallow copy of the err object

  error.message = err.message; // Set the message property of the error object

  if (err.code === 11000) {
    // Check if the error code indicates a duplicate key error
    const message = `Duplicate Field Value Entered`;
    error = new ErrorResponse(message, 400); // Create a new instance of ErrorResponse with the provided message and status code
  }

  if (err.name === "ValidationError") {
    // Check if the error name indicates a Mongoose validation error
    const message = Object.values(err.errors).map((val) => val.message);
    error = new ErrorResponse(message, 400); // Create a new instance of ErrorResponse with the extracted validation error messages and status code
  }

  res.status(error.statusCode || 500).json({
    // Send JSON response to the client
    success: false,
    errors: error.message || "Server Error", // Use the error message from the error object or a default "Server Error" message
  });
};

module.exports = errorHandler;
