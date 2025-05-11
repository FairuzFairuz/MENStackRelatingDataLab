import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

//Register User
export const register = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Username and password are required" });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });

    await newUser.save();

    const token = jwt.sign({ userId: newUser._id }, process.env.ACCESS_SECRET, {
      expiresIn: "20m",
    });

    res.status(201).json({ message: "User registered successfully", token });
  } catch (error) {
    console.error("Registration Error:", error); // Log full error for debugging
    res.status(500).json({ error: "Internal server error" });
  }
};
// Login User
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Username and password are required" });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_SECRET,
      {
        expiresIn: "20m",
      }
    );

    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.REFRESH_SECRET,
      {
        expiresIn: "30d",
      }
    );

    res.status(200).json({ access: accessToken, refresh: refreshToken });
  } catch (error) {
    console.error("Login Error:", error); // Log full error for debugging
    res.status(500).json({ error: "Internal server error" });
  }
};

// Refresh Token
export const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ error: "Refresh token is required" });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
    const newAccessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.ACCESS_SECRET,
      {
        expiresIn: "20m",
      }
    );

    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    console.error("Token Refresh Error:", error.message);
    res.status(401).json({ error: "Invalid refresh token" });
  }
};
