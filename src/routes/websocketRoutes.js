import express from "express";

const router = express.Router();

router.get("/socket", (req, res) => {
  res
    .status(200)
    .json({
      message:
        "Connect to this endpoint using a WebSocket client (ws://localhost:PORT/ws)",
    });
});

export default router;
