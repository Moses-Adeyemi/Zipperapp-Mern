const crypto = require('crypto');
const mongoose = require('mongoose'); // Import the Mongoose module
const bcrypt = require("bcryptjs"); // Import bcryptjs for password hashing
const jwt = require('jsonwebtoken');

// Define the user schema
const userSchema = new mongoose.Schema({
    // Username field
    username: {
        type: String,
        required: [true, "Please provide a username"]
    },
    // Email field
    email: {
        type: String,
        required: [
            true, "Please provide an email"
        ],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please provide a valid email"]
    },
    // Password field
    password: {
        type: String,
        required: [
            true, "Please provide a password"
        ],
        minlength: 6,
        select: false
    },
    // Reset password token field
    resetPasswordToken: String,
    // Reset password expiration field
    resetPasswordExpire: Date
});

// Middleware function to hash the password before saving
userSchema.pre("save", async function (next) {
    // Check if the password field is modified
    if (!this.isModified("password")) {
        next();
    }

    // Generate a salt
    const salt = await bcrypt.genSalt(10);

    // Hash the password with the generated salt
    this.password = await bcrypt.hash(this.password, salt);

    next();
});

userSchema.methods.matchPasswords = async function (password) {
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.getSignedToken = function () {
    return jwt.sign({
        id: this._id
    }, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRE});
};

userSchema.methods.getResetToken = function () {
    const resetToken = crypto.randomBytes(20).toString("hex");

    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
this.resetPasswordExpire = Date.now() + 10 * (60 * 1000);
    return resetToken

};


// Create the User model using the user schema
const User = mongoose.model("User", userSchema);

// Export the User model
module.exports = User;
