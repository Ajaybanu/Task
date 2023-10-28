import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
  fileName: String,
  fileType: String,
  fileURL: String,
  uploader: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // Reference to the User model
  },
  // ... other metadata fields related to files
}, { timestamps: true });

const File = mongoose.model('File', fileSchema);

export default File;
