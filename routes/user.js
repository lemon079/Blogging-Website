import { Router } from "express";
import {
  handleUserSignUp,
  handleUserLogin,
  handleUserLogout,
} from "../controller/user.js";
import multer from "multer";
import path from "path";
const router = Router();

router.get("/signup", (req, res) => {
  return res.render("signup");
});

router.get("/login", (req, res) => {
  return res.render("login");
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const fileSavePath = path.resolve("./public/uploads/profilePictures/");
    cb(null, fileSavePath);
  },
  filename: function (req, file, cb) {
    const filename = `${Date.now()}-${file.originalname}`;
    cb(null, filename);
  },
});

const upload = multer({ storage: storage });

router.post("/signup", upload.single("profilePicture"), handleUserSignUp);
router.post("/login", handleUserLogin);
router.get("/logout", handleUserLogout);

export default router;
