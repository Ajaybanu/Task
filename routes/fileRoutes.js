import express from 'express';
import { requireSignIn } from '../middlewares/authMiddleware.js';
import {
  uploadSingle,
  uploadMultiple,
  deleteFile,
  getFiles,
} from '../controllers/fileUploadController.js';

const router = express.Router();

// Upload routes
router.post('/upload-single', requireSignIn, uploadSingle);
router.post('/upload-multiple', requireSignIn, uploadMultiple);

// Deletion route
router.delete('/files/:id', requireSignIn, deleteFile);

// Retrieval route
router.get('/files', requireSignIn, getFiles);

export default router;
