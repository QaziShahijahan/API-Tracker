const mongoose = require("mongoose");

const ConsoleLogSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  level: { type: String }, 
  message: { type: String }
}, { _id: false });

const TracerLogSchema = new mongoose.Schema({
  traceId: { type: String, index: true },
  timestamp: { type: Date, default: Date.now, index: true },
  apiName: { type: String, index: true },
  method: { type: String },
  path: { type: String },
  statusCode: { type: Number, index: true },
  responseTimeMs: { type: Number },
  consoleLogs: [ConsoleLogSchema],
  meta: { type: mongoose.Mixed }
}, { timestamps: true });

module.exports = mongoose.model("TracerLog", TracerLogSchema);
