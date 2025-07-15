import express from "express";
import * as outSideController from "../controllers/outsideController.js";
import { methodNotAllowed } from "../middlewares/methodNotAllowed.js";

const router = express.Router();

router.get("/product-list", outSideController.getProductList);
router.get("/random-user", outSideController.getRandomUser);

router.all("/product-list", methodNotAllowed(["GET"]));
router.all("/random-user", methodNotAllowed(["GET"]));
export default router;
