const userModel = require("../models/user.model.js");
//const authController = require("../controllers/auth.controller.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

async function registerUser(req, res) {
  try {
    const { username, email, password, role } = req.body;

    const existingUser = await userModel.findOne({
      $or: [{ username }, { email }], //both must be unique
    });
    if (existingUser) {
      // console.log("User already registered");
      return res.status(409).json({
        success: false,
        message: "User already registered",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    // 10 is used as salt value to make password more stronger

    const user = await userModel.create({
      username,
      email,
      password: hashedPassword,
      role,
    });

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "3d",
      },
    );

    res.cookie("token", token);
    //this cookie will go to for every request of user , to verify the valid user for each request(more time consuming for attackers)
    // console.log("User registered successfully");
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      token, //we'll set this token with the help of cookies
    });
  } catch (err) {
    console.log("Register Error :", err);
    //always write a default line for errors , who always runs

    if (err.code === 11000) {
      // don't give only one condition otherwise it will get stucked
      return res.status(409).json({
        success: false,
        message: "User already registered",
      });
    }
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

async function loginUser(req, res) {
  try {
    const { username, email, password } = req.body;
    const user = await userModel.findOne({
      $or: [{ username }, { email }],
    });

    //if no user exists findOne will return 'null'.
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: " Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "6d",
        // token expiry time ( user will log out automatically after this amount of time)
      },
    );

    res.cookie("token", token, { httpOnly: true, maxAge: 60 * 1000 }); //1 minute
    // to delete token from the browser after this amount of time

    res.status(201).json({
      message: "User logged in successfully",
      user: {
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.log("error occured in login. " + err);
  }
}

module.exports = { loginUser, registerUser };
