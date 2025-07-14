import dotEnv from "dotenv";
import express from "express";
import authRoutes from "./src/routes/authRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import pdfRoutes from "./src/routes/pdfRoutes.js";
import db from "./models/index.js";
import messages from "./src/utils/constants.js";

//env config
dotEnv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Body parser
app.use(express.json());

app.use("/auth", authRoutes);

app.use("/user", userRoutes);

app.use("/pdf", pdfRoutes);

app.get("/error", (req, res, next) => {
  try {
    throw new Error("Something went wrong!");
  } catch (err) {
    next(err);
  }
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ status: "error", message: messages.notFound });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    status: "error",
    message: err.message || "Internal Server Error",
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
