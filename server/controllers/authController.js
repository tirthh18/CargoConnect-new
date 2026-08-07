const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const getCoordinates = require("../utils/getCoordinates");
const validator = require("validator");

async function register(req, res) {
  const { name, email, password, role, office } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      message: "All fields required",
    });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({
      message: "enter valid email id",
    });
  }

  if (role === "admin") {
    if (!office.address || !office.city || !office.pincode) {
      return res
        .status(400)
        .json({ message: "Office details are required for admin" });
    }

    const coordinates = await getCoordinates(
      office.address,
      office.city,
      "Gujrat",
      "India",
      office.pincode,
    );

    if (!coordinates) {
      return res.status(400).json({ message: "Invalid office address" });
    }

    office.coordinates = coordinates;
  }

  if (role === "agent" && !office?.city) {
    return res
      .status(400)
      .json({ message: "Office city is required for agent" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const user = new User({ name, email, password, role, office });
    await user.save();

    res.json({ user, message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "required all feilds" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ message: "invalid credentials" });

    const token = generateToken(user);

    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({ user: userResponse, token, message: "Login sucessfull" });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { login, register };
