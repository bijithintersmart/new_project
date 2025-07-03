import dotEnv from "dotenv";
import express from "express";
import authRoutes from "./src/routes/authRoutes.js";
import pool from "./src/db.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Body parser
app.use(express.json());
//env config
dotEnv.config();

app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Welcome!");
});

app.get("/error", (req, res, next) => {
  try {
    throw new Error("Something went wrong!");
  } catch (err) {
    next(err);
  }
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ status: "error", message: "Not Found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    status: "error",
    message: err.message || "Internal Server Error",
  });
});

pool
  .authenticate()
  .then(async (result) => {
    app.listen(PORT, () => {
      console.log(`Backend listens to ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err.toString());
  });
