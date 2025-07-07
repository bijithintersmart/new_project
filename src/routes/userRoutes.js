import express from "express";
import authenticate from "../middlewares/authMiddleware.js";
import { updateUser } from "../controllers/authController.js";
import {methodNotAllowed} from '../middlewares/methodNotAllowed.js'

const router = express.Router();

router.get("/home", authenticate, (req, res) => {
  res.json({
    message: `Welcome ${req.user.username}`,
    user: req.user,
  });
});

router.put("/update", authenticate, updateUser);

router.all("/home", methodNotAllowed(["GET"]));
router.all("/update", methodNotAllowed(["PUT"]));
  
export default router;
