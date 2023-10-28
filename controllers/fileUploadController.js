import AWS from 'aws-sdk';
import multer from 'multer';
import multerS3 from 'multer-s3';
import File from '../models/FIlemodel.js';
import dotenv from 'dotenv';

dotenv.config();

// Configure AWS S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION,
});

console.log(process.env.AWS_ACCESS_KEY,"aaaaaaaaaaa")
console.log(process.env.AWS_SECRET_KEY,"sssssssss")
console.log(process.env.AWS_REGION,"rrrrrrrr")
const uploadS3 = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME,
    acl: 'public-read',
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString() + '-' + file.originalname);
    },
  }),
});

export const uploadSingle = (req, res) => {
  const singleUpload = uploadS3.single('file'); // Assuming 'file' is the field name

  singleUpload(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ message: 'File upload failed', error: err });
    }

    // Store metadata in MongoDB
    const { filename, fieldname } = req.file;
    const file = new File({
      fileName: filename,
      fileType: fieldname,
      fileURL: req.file.location, // If using AWS S3, the file URL will be available here
      uploader: req.user._id, // Assuming you have user data stored in req.user
    });

    try {
      await file.save();
      res.status(200).json({ message: 'File uploaded and metadata stored successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error storing metadata', error: error });
    }
  });
};

export const uploadMultiple = (req, res) => {
  uploadS3.array('files', 5, async (err) => {
    if (err) {
      return res.status(500).json({ message: 'Error uploading files', error: err });
    }

    try {
      const filesData = req.files.map((file) => ({
        fileName: file.key,
        fileType: file.fieldname,
        fileURL: file.location,
        uploader: req.user._id,
      }));

      const insertedFiles = await File.insertMany(filesData);
      res.status(200).json({ message: 'Multiple files uploaded and metadata stored successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error storing metadata', error: error });
    }
  })(req, res);
};

export const deleteFile = async (req, res) => {
  try {
    const fileId = req.params.id;
    const deletedFile = await File.findByIdAndDelete(fileId);
    if (!deletedFile) {
      return res.status(404).json({ message: 'File not found' });
    }
    res.status(200).json({ message: 'File deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting file', error: error });
  }
};

export const getFiles = async (req, res) => {
  try {
    const userId = req.user._id; // Get user ID from authentication
    const files = await File.find({ uploader: userId });
    res.status(200).json(files);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching files', error: error });
  }
};
