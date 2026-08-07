const musicModel = require("../models/music.model.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const upLoadFile = require("../services/storage.service.js");
const albumModel = require("../models/album.model.js");

//albumModel is a short file ,
// we are not gonna create another 'album.controller.js' file for this,

async function createMusic(req, res) {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  let decoded; // to use outside of this
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "artist") {
      return res.status(403).json({
        message: "You don't have access to create an music",
      });
    }
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { title } = req.body;
  const file = req.file;

  //console.log("Body:", req.body);
  //console.log("File:", req.file);

  const result = await upLoadFile(file.buffer.toString("base64"));
  const music = await musicModel.create({
    uri: result.url,
    title,
    artist: decoded.id,
  });

  res.status(201).json({
    message: "Music created successfully",
    music: {
      id: music._id,
      uri: music.uri,
      title: music.title,
      artist: music.artist,
    },
  });
}

async function createAlbum(req, res) {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "artist") {
      return res
        .status(403)
        .json({ message: "You don't have access to create an music" });
    }

    const { title, musicIds } = req.body;
    console.log(req.body);
    console.log(musicIds);
    const album = await albumModel.create({
      title,
      artist: decoded.id,
      musics: musicIds,
    });
    res.status(201).json({
      message: "Album created successfully",
      album: {
        id: album._id,
        title: album.title,
        artist: album.artist,
        music: album.musics,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(401).json({ message: "an error occured!" });
  }
}

module.exports = { createMusic, createAlbum };
