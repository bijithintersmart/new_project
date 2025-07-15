import express from "express";
import * as pdfController from "../controllers/pdfController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import { methodNotAllowed } from "../middlewares/methodNotAllowed.js";

const router = express.Router();

router.get("/generate-pdf", authMiddleware, pdfController.generatePdf);
router.post(
  "/generate-pdf-from-data",
  authMiddleware,
  pdfController.generatePdfFromData
);
router.post(
  "/generate-pdf-from-html",
  authMiddleware,
  pdfController.generatePdfFromHtml
);

router.all("/generate-pdf", methodNotAllowed(["GET"]));
router.all("/generate-pdf-from-data", methodNotAllowed(["POST"]));
router.all("/generate-pdf-from-html", methodNotAllowed(["POST"]));

export default router;
