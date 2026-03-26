import User from "../models/userModel.js"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const jwt_Secret = "123456789abcdef"; // 🔥 USE ENV VARIABLE IN PRODUCTION
export const signup = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "Please fill all the fields" });
  }

  const ExistingUser = await User.findOne({ email });

  if (ExistingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);


  const newUser = new User({
    username,
    email,
    password: hashedPassword
  })

  try {
    await newUser.save();
    const token = jwt.sign({ id: newUser._id }, jwt_Secret, {
      expiresIn: "7d",
    });
    res.status(201).json({ message: "User created successfully", token });
  } catch (error) {
    console.error(error); // 🔥 ADD THIS
    res.status(500).json({ message: error.message });
  }

}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, jwt_Secret, { expiresIn: "7d" });

    res.status(200).json({
      success: true,
      user,
      token,
      message: "Logged in successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};