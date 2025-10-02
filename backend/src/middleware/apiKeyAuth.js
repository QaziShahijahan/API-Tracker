const ApiKey = require("../models/ApiKey");

async function apiKeyAuth(req, res, next) {
  try {
    const key = req.header("x-api-key");
    if (!key) return res.status(401).json({ message: "Missing x-api-key header" });

    const keyDoc = await ApiKey.findOne({ key, active: true });
    if (!keyDoc) return res.status(401).json({ message: "Invalid API key" });

    if (keyDoc.expiresAt && new Date() > keyDoc.expiresAt) {
      return res.status(401).json({ message: "API key expired" });
    }

    req.apiKeyOwner = keyDoc.owner || "unknown";
    next();
  } catch (err) {
    console.error("apiKeyAuth error", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = apiKeyAuth;
