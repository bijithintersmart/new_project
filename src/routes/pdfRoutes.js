import express from 'express';
import * as pdfController from '../controllers/pdfController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/generate-pdf', authMiddleware, pdfController.generatePdf);
router.post('/generate-pdf-from-data', authMiddleware, pdfController.generatePdfFromData);

export default router;
