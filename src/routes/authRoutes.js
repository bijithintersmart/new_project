
import express from "express";
import { register, login, updateUser } from "../controllers/authController.js";
import authenticate from "../middlewares/authMiddleware.js";

const router = express.Router();

import upload from "../middlewares/uploadMiddleware.js";

router.post("/register", upload.single('image'), register);
router.post("/login", login);
router.put("/update", authenticate, updateUser);

router.get("/protected", authenticate, (req, res) => {
  const userData = {
    id: 1,
    username: req.user.username,
    email: `${req.user.username}@example.com`,
  };
  res.json({
    message: `Welcome ${req.user.username}`,
    data: userData,
  });
});

export default router;
