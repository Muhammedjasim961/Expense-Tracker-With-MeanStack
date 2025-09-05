const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../Models/User.model.js");

const userRegister = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const exitUser = await User.findOne({ email });
    if (exitUser) {
      res.status(401).json({ message: "User already exits" });
    }
    console.log("Password:", password);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log("hashed password", hashedPassword);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    console.log({ newUser });

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("signUp", error);
    res.status(500).json({ message: "Server error during registration" });
  }
};
const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ message: "user was Not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign(
      { id: user._id }, // payload
      process.env.JWT_SECRET, // secret key
      { expiresIn: "1h" } // token valid for 1 hour);
    );
    // localStorage.setItem("token", token);

    // const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log("decode", decoded);
    res.json({
      message: token,
      // user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("Login Error", error);
    res.status(500).json({ message: "Server error during registration" });
  }
};
module.exports = { userRegister, userLogin };
