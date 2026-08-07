const express = require("express");
const router = express.Router();

const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

const musicController = require("../controllers/music.controller.js");
const userModel = require("../models/user.model.js");

router.post("/upload", upload.single("music"), musicController.createMusic);

router.post("/album", musicController.createAlbum);
module.exports = router;
