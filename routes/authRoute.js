import express from "express";
import {
  registerController,
  loginController,
  testController,

  
} from "../controllers/authController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";

import { uploadMultiple, uploadSingle, upload } from "../controllers/fileUploadController.js"


//router object
const router = express.Router();

//routing
//REGISTER || METHOD POST
router.post("/register", registerController);

//LOGIN || POST
router.post("/login", loginController);

//test routes
router.get("/test", requireSignIn, isAdmin, testController);

router.post("/uploadsingle", upload.single("image") ,uploadSingle  );

router.post("/upload-multiple",upload.array("images", 3) ,uploadMultiple);
export default router;