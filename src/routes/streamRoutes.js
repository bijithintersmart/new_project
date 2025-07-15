import express from 'express';
import { streamVideo } from '../controllers/streamController.js';

const router = express.Router();

router.get('/video/:filename', streamVideo);

export default router;