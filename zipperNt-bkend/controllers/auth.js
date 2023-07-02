const User = require('../models/User');

const sendToken = (user, statusCode, res) => {
  const token = user.getSignedToken();
  res.status(statusCode).json({ success: true, token });
};

exports.register = async (req, res, next) => {
  const { username, email, password } = req.body;

  try {
    const user = await User.create({ username, email, password });

    return sendToken(user, 201, res);
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};


exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  // Check if email and password are provided
  if (!email || !password) {
    res.status(404).json({ success: false, error: "Please provide email and password" });
  }
  try {
    const user = await User.findOne({ email }).select("+password");
    // Check if user exists
    if (!user) {
      res.status(404).json({ success: false, error: "Invalid credentials" });
    }
    const isMatch = await user.matchPasswords(password);
    // Perform further actions based on password match result (isMatch)
    if (!isMatch) {
      res.status(404).json({ success: false, error: "Invalid credentials" });
    }
    return sendToken(user, 200, res);
  } catch (error) { // Handle any errors that occur during the login process
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.forgotpassword = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return next(new ErrorResponse("Email could not be found", 404));
    }

    const resetToken = user.getResetPasswordToken();

    // Rest of the code for sending the reset token to the user's email
await user.save();
const resetUrl = `http://localhost:3000/passwordreset/${resetToken}`;

const message=`
<h1> You have requested a password reset</h1>
<p>Please go to this link to reset your password</p>
<a href=${resetUrl} clicktractking=off>${resetUrl}</a>
`
   
  } catch (error) {
    next(error);
  }
};

