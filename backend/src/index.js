require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const tracerRoutes = require("./routes/tracerRoutes");
const configRoutes = require("./routes/configRoutes");
const keyRoutes = require("./routes/keyRoutes");

const PORT = process.env.PORT || 4000;
const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://qazishahijahan1210_db_user:qazishahijahan1210_db_user@cluster0.uzuqeug.mongodb.net/tracerdb?retryWrites=true&w=majority&appName=Cluster0";

const app = express();

/**
 * ✅ CORS setup
 * In production, set ALLOWED_ORIGINS env var to your frontend URL(s).
 * Example in Render:
 *   ALLOWED_ORIGINS=https://your-frontend.onrender.com
 * For multiple origins:
 *   ALLOWED_ORIGINS=https://site1.com,https://site2.com
 */
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : ["http://localhost:5173"]; // default for local Vite dev

const corsOptions = {
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("CORS not allowed for this origin: " + origin));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "2mb" }));

// routes
app.use("/api/tracer", tracerRoutes);
app.use("/api/configs", configRoutes);
app.use("/api/keys", keyRoutes);

// simple health check
app.get("/health", (req, res) => res.json({ status: "ok" }));

// connect to DB and start server
connectDB(MONGODB_URI).then(() => {
  app.listen(PORT, () => {
    console.log(`Tracer API running on http://localhost:${PORT}`);
    console.log("Allowed Origins:", allowedOrigins);
  });
});
