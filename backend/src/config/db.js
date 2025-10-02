const mongoose = require("mongoose");

async function connectDB(uri) {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("Connection Established Successfully ..." , mongoose.connection.name);
  } catch (err) {
    console.error("Error Occured !!", err);
    process.exit(1);
  }
}

module.exports = connectDB;
