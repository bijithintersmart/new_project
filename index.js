import dotEnv from "dotenv";
import express from "express";
import authRoutes from "./src/routes/authRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import pdfRoutes from "./src/routes/pdfRoutes.js";
import outSideRoutes from "./src/routes/outSideRoutes.js";
import AppError from "./src/utils/appError.js";
import db from "./models/index.js";

//env config
dotEnv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Body parser
app.use(express.json());

app.use("/auth", authRoutes);

app.use("/user", userRoutes);

app.use("/pdf", pdfRoutes);

app.use("/outside", outSideRoutes);

app.get("/error", (req, res, next) => {
  try {
    throw new Error("Something went wrong!");
  } catch (err) {
    next(err);
  }
});

// 404 handler
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handler
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

const startServer = async () => {
  try {
    await db.sequelize.authenticate();
    console.log("✅ Database connected");

    await db.sequelize.sync({ alter: true });
    console.log("✅ Models synced");

    app.listen(PORT, () => {
      console.log(`🚀 Backend listening on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Unable to start server:", error.message || error);
  }
};

startServer();
