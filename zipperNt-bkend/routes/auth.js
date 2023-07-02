const express = require('express');
const router = express.Router(); // Create a new instance of an Express router

const { register, login, forgotpassword, resetpassword } = require('../controllers/auth'); // Import the controller functions for different authentication routes

router.route("/register").post(register); // Define a POST route for user registration

router.route("/login").post(login); // Define a POST route for user login

router.route("/forgotpassword").post(forgotpassword); // Define a POST route for forgot password functionality

router.route("/resetpassword/:resetToken").put(resetpassword); // Define a PUT route for resetting password using a reset token

module.exports = router; // Export the router to make it available for use in other modules

