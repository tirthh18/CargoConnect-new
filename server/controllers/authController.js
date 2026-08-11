const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const validator = require("validator");

async function register(req, res) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      message: "All fields required",
    });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({
      message: "Enter valid email id",
    });
  }

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const user = new User({ name, email, password, role: "user",});

    await user.save();

    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({
      success: true,
      user: userResponse,
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("Register Error:", error);

    res.status(500).json({
      success: false,
      message: "Registration failed",
      error: error.message,
    });
  }
}

async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Required all fields",
    });
  }

  try {
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const token = generateToken(user);

    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(200).json({
      success: true,
      user: userResponse,
      token,
      message: "Login successful",
    });
  } catch (error) {
    console.error("Login Error:", error);

    res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
}

module.exports = {
  login,
  register,
};