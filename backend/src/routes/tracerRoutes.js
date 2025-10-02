const express = require("express");
const router = express.Router();
const TracerLog = require("../models/TracerLog");
const apiKeyAuth = require("../middleware/apiKeyAuth");


router.post("/log", apiKeyAuth, async (req, res) => {
  
  try {
    const payload = req.body;
    const doc = await TracerLog.create(payload);
    res.status(201).json({ message: "Log saved", id: doc._id });
  } catch (err) {
    console.error("Error saving tracer log", err);
    res.status(500).json({ message: "Error saving tracer log" });
  }
});

router.get("/logs", async (req, res) => {
  try {
    const { apiName, from, to, page = 1, pageSize = 50 } = req.query;
    const query = {};
    if (apiName) query.apiName = apiName;
    if (from || to) query.timestamp = {};
    if (from) query.timestamp.$gte = new Date(from);
    if (to) query.timestamp.$lte = new Date(to);

    const skip = (parseInt(page) - 1) * parseInt(pageSize);
    const total = await TracerLog.countDocuments(query);
    const data = await TracerLog.find(query)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(parseInt(pageSize))
      .lean();

    res.json({
      data,
      pagination: {
        currentPage: parseInt(page),
        pageSize: parseInt(pageSize),
        total,
        totalPages: Math.ceil(total / pageSize)
      }
    });
  } catch (err) {
    console.error("Error fetching logs", err);
    res.status(500).json({ message: "Error fetching logs" });
  }
});

router.get("/stats", async (req, res) => {
  try {
    const { apiName, from, to } = req.query;
    const match = {};
    if (apiName) match.apiName = apiName;
    if (from || to) match.timestamp = {};
    if (from) match.timestamp.$gte = new Date(from);
    if (to) match.timestamp.$lte = new Date(to);

    const pipeline = [
      { $match: match },
      {
        $group: {
          _id: null,
          totalRequests: { $sum: 1 },
          avgResponseTime: { $avg: "$responseTimeMs" },
          successCount: { $sum: { $cond: [{ $and: [{ $gte: ["$statusCode", 200] }, { $lt: ["$statusCode", 300] }] }, 1, 0] } },
          errorCount: { $sum: { $cond: [{ $gte: ["$statusCode", 400] }, 1, 0] } },
          lastDowntime: { $max: { $cond: [{ $gte: ["$statusCode", 400] }, "$timestamp", null] } }
        }
      }
    ];

    const resAgg = await TracerLog.aggregate(pipeline);
    const result = resAgg[0] || {
      totalRequests: 0,
      avgResponseTime: 0,
      successCount: 0,
      errorCount: 0,
      lastDowntime: null
    };

    const errorCodeAgg = await TracerLog.aggregate([
      { $match: { ...match, statusCode: { $gte: 400 } } },
      { $group: { _id: "$statusCode", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ]);

    const mostCommonError = (errorCodeAgg[0] && errorCodeAgg[0]._id) || null;

    const uptimePct = result.totalRequests > 0 ? (result.successCount / result.totalRequests) * 100 : 100;
    const errorRate = result.totalRequests > 0 ? (result.errorCount / result.totalRequests) * 100 : 0;

    res.json({
      totalRequests: result.totalRequests,
      avgResponseTime: Math.round(result.avgResponseTime || 0),
      uptimePercentage: Number(uptimePct.toFixed(2)),
      errorRate: Number(errorRate.toFixed(2)),
      mostCommonError,
      lastDowntime: result.lastDowntime
    });
  } catch (err) {
    console.error("Error computing stats", err);
    res.status(500).json({ message: "Error computing stats" });
  }
});

module.exports = router;
