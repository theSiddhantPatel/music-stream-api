const mongoose = require("mongoose");
async function connectDB() {
  try {
    await mongoose
      .connect(process.env.MONGO_URI)

      .then(() => {
        console.log("DB connected");
      });
  } catch (err) {
    console.log("db connection error : " + err);
  }
}
module.exports = connectDB;
