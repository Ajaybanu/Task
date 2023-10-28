import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
 
 {
  photoUrl: String,
    },

  
  { timestamps: true }
);

export default mongoose.model("files", fileSchema);