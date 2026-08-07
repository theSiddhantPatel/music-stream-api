const express = require("express");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth.routes.js");
const musicRoutes = require("./routes/music.routes.js");
const app = express();
app.use(express.json());
app.use(cookieParser());

app.get("/hi", (req, res) => {
  res.send("HI");
});

app.use("/api/auth", authRoutes);
// run all authRoutes with prefix '/api/auth/'
app.use("/api/music", musicRoutes);

module.exports = app;
