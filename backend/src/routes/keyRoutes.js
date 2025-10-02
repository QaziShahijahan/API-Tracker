const express = require("express");
const router = express.Router();
const ApiKey = require("../models/ApiKey");
const { v4: uuidv4 } = require("uuid");


// create key
router.post("/", async (req, res) => {
  try {
    const { owner, expiresAt, meta } = req.body;
    const key = uuidv4();
    const doc = await ApiKey.create({ key, owner, expiresAt, meta });
    res.status(201).json(doc);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating key" });
  }
});

// list keys
router.get("/", async (req, res) => {
  try {
    const keys = await ApiKey.find().sort({ createdAt: -1 }).lean();
    res.json(keys);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching keys" });
  }
});

// deactivate/activate key
router.patch("/:id", async (req, res) => {
  try {
    const { active } = req.body;
    const doc = await ApiKey.findByIdAndUpdate(req.params.id, { active }, { new: true });
    res.json(doc);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
