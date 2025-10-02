require("dotenv").config();
const connectDB = require("../config/db");
const ApiKey = require("../models/ApiKey");
const ApiConfig = require("../models/ApiConfig");

(async () => {
  try {
    const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/tracerdb";
    await connectDB(uri);

    const exampleKey = process.env.TRACER_API_KEY || "abcd1234-ef56-7890-gh12-ijkl345678mn";

    const existing = await ApiKey.findOne({ key: exampleKey });
    if (!existing) {
      await ApiKey.create({
        key: exampleKey,
        owner: "demo",
        active: true
      });
      console.log("Seeded example API key:", exampleKey);
    } else {
      console.log("Example key already exists");
    }

    // Seed some API configs
    const apis = [
      { endpointName: "/api/social", scheduling: { enabled: true, startTime: "00:00", endTime: "23:59" }, requestLimit: 0, rateUnit: "hour" },
      { endpointName: "/api/link", scheduling: { enabled: false }, requestLimit: 0, rateUnit: "hour" },
      { endpointName: "/api/data", scheduling: { enabled: true, startTime: "00:00", endTime: "23:59" }, requestLimit: 100000, rateUnit: "day" }
    ];

    for (const a of apis) {
      const exist = await ApiConfig.findOne({ endpointName: a.endpointName });
      if (!exist) {
        await ApiConfig.create(a);
        console.log("Created config", a.endpointName);
      }
    }

    console.log("Seed complete");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
