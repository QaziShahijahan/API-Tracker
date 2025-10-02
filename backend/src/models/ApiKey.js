const mongoose = require("mongoose");

const ApiKeySchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  owner: { type: String },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date },
  active: { type: Boolean, default: true },
  meta: { type: mongoose.Mixed }
});

module.exports = mongoose.model("ApiKey", ApiKeySchema);
