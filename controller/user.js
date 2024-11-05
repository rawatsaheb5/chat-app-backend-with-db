const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { trusted } = require("mongoose");

// Secret key for JWT (store this in your .env file)
const JWT_SECRET = process.env.JWT_SECRET;

// Signup Controller
const signUp = async (req, res) => {
  try {
    const { name, email, password, gender } = req.body;

    if (!name || !email || !password || !gender) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      gender,
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error });
  }
};

// Login Controller
const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { userId: user._id },
      JWT_SECRET,
      { expiresIn: "1h" } // Token expiration time
    );
    res.cookie("token", token, {
      httpOnly: true, // Cookie is not accessible via JavaScript
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      maxAge: 60 * 60 * 1000, // 1 hour in milliseconds
    });
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        gender: user.gender,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Error logging in", error });
  }
};

// Logout Controller
const signOut = (req, res) => {
  res.clearCookie("token"); // Clear the token cookie
  res.status(200).json({ message: "Logged out successfully" });
};





module.exports = {
  signUp,
  signIn,
  signOut,
};
