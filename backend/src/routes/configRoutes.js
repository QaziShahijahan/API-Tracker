const express = require("express");
const router = express.Router();
const ApiConfig = require("../models/ApiConfig");

// Example for configs API
// router.use(tracerMiddleware("/api/configs"));


// List configs
router.get("/", async (req, res) => {
  try {
    const configs = await ApiConfig.find().sort({ endpointName: 1 }).lean();
    res.json(configs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching configs" });
  }
});

// Create new
router.post("/", async (req, res) => {
  try {
    const payload = req.body;
    const conf = new ApiConfig(payload);
    await conf.save();
    res.status(201).json(conf);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});

// Update
router.put("/:id", async (req, res) => {
  try {
    const updated = await ApiConfig.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});

// Delete
router.delete("/:id", async (req, res) => {
  try {
    await ApiConfig.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
