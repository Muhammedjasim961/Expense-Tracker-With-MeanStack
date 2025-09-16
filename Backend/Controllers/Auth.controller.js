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
    console.log("Login request body:", req.body);

    const user = await User.findOne({ email });
    console.log("Found user:", user);

    if (!user) {
      return res.status(401).json({ message: "Incorrect Email Format!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match:", isMatch);

    if (!isMatch) {
      return res.status(400).json({ message: "Password is not Matching" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "5m",
    });

    res.json({
      message: token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username, //passing  username and email to display front end profile name and email
      },
    });
  } catch (error) {
    console.error("Login Error", error);
    res.status(500).json({ message: "Server error during login" });
  }
};

module.exports = { userRegister, userLogin };
