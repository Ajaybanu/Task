import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import multer from 'multer';
import dotenv from 'dotenv';
import FILES from '../models/FIlemodel.js';

dotenv.config();

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  }
});

const uploadToS3 = async (fileData) => {
  const uploadParams = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Body: fileData,
    Key: `${Date.now().toString()}.jpg`,
  };

  return await s3Client.send(new PutObjectCommand(uploadParams));
};

export const uploadSingle = async (req, res) => {
  if (req.file) {
    try {
      await uploadToS3(req.file.buffer);

      // Save file details to MongoDB
      await FILES.create({ photoUrl: req.file.location }); // Assuming req.file.location holds the S3 URL

      return res.status(200).json({
        msg: 'Image uploaded successfully',
      });
    } catch (error) {
      return res.status(500).json({
        msg: 'Failed to upload image',
        error: error.message
      });
    }
  } else {
    return res.status(400).json({
      msg: 'No file received',
    });
  }
};

export const uploadMultiple = async (req, res) => {
  if (req.files && req.files.length > 0) {
    try {
      for (const file of req.files) {
        await uploadToS3(file.buffer);
        // Additional logic to save file details to MongoDB can be added here
      }

      return res.status(200).json({
        msg: `Successfully uploaded ${req.files.length} files!`,
      });
    } catch (error) {
      return res.status(500).json({
        msg: 'Failed to upload files',
        error: error.message
      });
    }
  } else {
    return res.status(400).json({
      msg: 'No files received',
    });
  }
};
