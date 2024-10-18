import User from "../models/user.model.js";
import createSecretToken from "../util/secretToken.js";
import bcrypt from "bcryptjs";

// Signup controller
export const SignUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existUser = await User.findOne({ email });
    if (existUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Create a new user
    const user = await User.create({ name, email, password });

    // Generate token and set cookie
    const token = createSecretToken(user._id);
    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: false,
    });

    // Return success response
    res
      .status(201)
      .json({ message: "User signed up successfully", success: true, user });
  } catch (error) {
    console.log("auth side error: ", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Login controller
export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "All fields are required", success: false });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ message: "Incorrect email or password", success: false });
    }

    // Compare passwords
    const auth = await bcrypt.compare(password, user.password);
    if (!auth) {
      return res
        .status(401)
        .json({ message: "Incorrect email or password", success: false });
    }

    // Generate token and set cookie
    const token = createSecretToken(user._id);
    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: false,
    });

    // Return success response
    res
      .status(200)
      .json({ message: "User logged in successfully.", success: true });
  } catch (error) {
    console.log("Login side error", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Logout controller
export const Logout = async (req, res) => {
  try {
    // Clear the cookie that stores the token
    res.clearCookie("token", {
      withCredentials: true,
      httpOnly: false,
    });

    // Return success response
    return res.status(200).json({ message: "User logged out successfully", success: true });
  } catch (error) {
    console.log("Logout side error", error);
    res.status(500).json({ message: "Server error" });
  }
};
