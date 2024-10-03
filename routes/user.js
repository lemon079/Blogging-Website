import { Router } from "express";
import {
  handleUserSignUp,
  handleUserLogin,
  handleUserLogout,
} from "../controller/user.js";
const router = Router();

router.get("/signup", (req, res) => {
  return res.render("signup");
});

router.get("/login", (req, res) => {
  return res.render("login");
});

router.post("/signup", handleUserSignUp);
router.post("/login", handleUserLogin);
router.get("/logout", handleUserLogout);

export default router;
