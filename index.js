import dotEnv from "dotenv";
import express from "express";
import helmet from 'helmet';
import http from "http";
import authRoutes from "./src/routes/authRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import pdfRoutes from "./src/routes/pdfRoutes.js";
import outSideRoutes from "./src/routes/outSideRoutes.js";
import websocketDocsRoute from "./src/routes/websocketRoutes.js";
import AppError from "./src/utils/appError.js";
import db from "./models/index.js";
import setupWebSocket from "./src/controllers/websocketController.js";

// env config
dotEnv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Create HTTP server from Express app
const server = http.createServer(app);

// Body parser
app.use(express.json());

// Security Headers with Helmet
app.use(helmet());

// Basic Content Security Policy (CSP)
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'"], // 'unsafe-inline' is often needed for development, but should be removed in production
    styleSrc: ["'self'", "'unsafe-inline'"], // 'unsafe-inline' is often needed for development, but should be removed in production
    imgSrc: ["'self'", "data:", "https://fakestoreapi.com"], // Allow images from your domain, data URIs, and fakestoreapi
    connectSrc: ["'self'", "ws://localhost:3000"], // Allow connections to your WebSocket server
  },
}));

// Define routes
app.use("/auth", authRoutes);

app.use("/user", userRoutes);

app.use("/pdf", pdfRoutes);

app.use("/outside", outSideRoutes);

app.use("/ws", websocketDocsRoute);

app.get("/error", (req, res, next) => {
  try {
    throw new Error("Something went wrong!");
  } catch (err) {
    next(err);
  }
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ status: "error", message: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

// Start server
const startServer = async () => {
  try {
    await db.sequelize.authenticate();
    console.log("✅ Database connected");

    await db.sequelize.sync({ alter: true });
    console.log("✅ Models synced");

    setupWebSocket(server);
    server.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`✅ websocket can be used on http://localhost:${PORT}/ws`);
    });
  } catch (error) {
    console.error("❌ Unable to start server:", error.message || error);
  }
};

startServer();
