const mongoose = require("mongoose");

const ApiConfigSchema = new mongoose.Schema({
  endpointName: { type: String, required: true, unique: true },
  startDate: { type: Date, default: Date.now },   
  scheduling: {
    enabled: { type: Boolean, default: false },
    startTime: { type: String },
    endTime: { type: String }
  },
  requestLimit: { type: Number, default: 0 },
  rateUnit: { type: String, enum: ['hour', 'day', 'minute'], default: 'hour' },
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }   
});

module.exports = mongoose.model("ApiConfig", ApiConfigSchema);
