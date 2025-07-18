const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await User.create({
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "User registered successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Check if user exists

    if (!email || !password) {
      return res.status(400).json({
        message: "Please provide  both email and password",
      });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    //Check if  password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    // If password is invalid return error
    if (!isPasswordValid) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    //JWT token generation can be added here
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    //Send login email(optional)

    //Set the token in the cookie
    res.cookie("token", token, {
      httpOnly: true,

      maxAge: 3600000, // 1 hour
    });

    //Respond with success message
    res.status(200).json({
      message: "User logged in successfully",
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      token: token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

const logoutUser = (req, res) => {
  // Clear the cookie
  res.clearCookie("token");
  res.status(200).json({
    message: "User logged out successfully",
  });
};

module.exports = {
  register,
  loginUser,
  logoutUser,
};
