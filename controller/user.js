import User from "../model/user.js";
import { createToken } from "../utils/auth.js";

async function handleUserSignUp(req, res) {
  const { fullname: fullName, email, password } = req.body;
  try {
    const userExist = await User.findOne({ email });
    if (userExist) throw new Error("User Already Exists with this Email");
    const user = await User.create({
      fullName,
      email,
      password,
    });
    if (!user) throw new Error("Could not create User");
    return res.redirect("/login");
  } catch (error) {
    return res.render("signup", {
      error,
    });
  }
}

async function handleUserLogin(req, res) {
  const { email, password } = req.body;
  try {
    const userExist = await User.findOne({ email });
    if (!userExist) throw new Error("User Don't Exist with this Email");
    const decodePassword = await User.matchPassword(email, password);
    if (!decodePassword) throw new Error("Wrong Password, Try Again");
    const token = createToken(userExist);
    res.cookie("token", token);
    return res.redirect("/blogs");
  } catch (error) {
    return res.render("login", {
      error,
    });
  }
}

function handleUserLogout(req, res) {
  res.clearCookie("token");
  return res.redirect("/blogs");
}

export { handleUserSignUp, handleUserLogin, handleUserLogout };
