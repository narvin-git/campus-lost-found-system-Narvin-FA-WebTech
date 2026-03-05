require("dotenv").config();
const path = require("path");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const itemsRoutes = require("./routes/items.routes");

const app = express();

// Security middleware : helmet sets secure HTTP headers including CSP
app.use(helmet());
app.use(cors());

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting (basic anti-spam)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per 15 min per IP
  message: "Too many requests, please try again later.",
});
app.use("/api",limiter);

// Static frontend
app.use(express.static(path.join(__dirname, "public")));

// API routes
app.use("/api/items", itemsRoutes);

// 404 handler (required)
app.use((req, res) => {
  if (req.path.startsWith("/api/")) {
    return res.status(404).json({ error: "API route not found" });
  }
  return res.status(404).sendFile(path.join(__dirname, "public", "404.html"));
});

// Server error handler (required)
app.use((err, req, res, next) => {
  console.error(err);
  if (req.path.startsWith("/api/")) return res.status(500).json({ error: "Server error" });
  return res.status(500).send("Server error");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Running: http://localhost:${PORT}`));