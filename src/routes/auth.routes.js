const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller.js");
const userModel = require("../models/user.model.js");

router.post("/register", authController.registerUser);

router.post("/login", authController.loginUser);

module.exports = router;
