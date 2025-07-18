import express from "express";
import { register, login, forgotPassword } from "../controllers/authController.js";
import upload from "../middlewares/uploadMiddleware.js";
import { methodNotAllowed } from "../middlewares/methodNotAllowed.js";

const router = express.Router();

// Public routes
router.post("/register", upload.single("image"), register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);

router.all("/register", methodNotAllowed(["POST"]));

router.all("/login", methodNotAllowed(["POST"]));
export default router;
