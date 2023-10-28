import aws  from "aws-sdk";
import multer  from "multer";
import multerS3  from "multer-s3";
import dotenv from "dotenv";
import FILES from "../models/FIlemodel.js";
import {PutObjectCommand, S3Client }from '@aws-sdk/client-s3'

dotenv.config();

aws.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
})
const s3 = new aws.S3();

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId : process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  }
})


//Specify the multer config
export const  upload = multer({
  // storage: multer.memoryStorage(),
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: function (req, file, done) {
    if (
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg"
    ) {
      done(null, true);
    } else {
      //prevent the upload
      var newError = new Error("File type is incorrect");
      newError.name = "MulterError";
      done(newError, false);
    }
  },
});

const uploadToS3 = (fileData) => {
  return new Promise((resolve, reject) => {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `${Date.now().toString()}.jpg`,
      Body: fileData,
    };
    s3.upload(params, (err, data) => {
      if (err) {
        console.log(err);
        return reject(err);
      }
      console.log(data);
      return resolve(data);
    });
  });
};


const uploadS3 = async(fileData)=> {
  const uploadParams = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Body: fileData,
    Key: `${Date.now().toString()}.jpg`,
    
  }

  return await s3Client.send(new PutObjectCommand(uploadParams));
}




export const uploadSingle = async (req, res) => {
  console.log(req.file);
  if (req.file) {
    await uploadS3(req.file.buffer);
  }
console.log("klsdfjksdhfsd")
  res.send({
    msg: "Image uploaded succesfully",
  });
};


//upload multiple image

export const uploadMultiple = async (req, res) => {
  // console.log(req.files);

  if (req.files && req.files.length > 0) {
    for (var i = 0; i < req.files.length; i++) {
      // console.log(req.files[i]);
      await uploadToS3(req.files[i].buffer);
    }
  }

  res.send({
    msg: "Successfully uploaded " + req.files.length + " files!",
  });
};

