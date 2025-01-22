import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoConnection from "./connection.js";
import blogRoutes from "./routes/blog.js";
import userRoutes from "./routes/user.js";
import blogStaticRoutes from "./routes/blogStaticRoutes.js";
import userStaticRoutes from "./routes/userStaticRoutes.js";
import cookieParser from "cookie-parser";
import path from "path";
import { checkForAuthentication } from "./middleware/auth.js";
const app = express();
import utilRoute from "./routes/utilRoutes.js";

// ejs
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.resolve("./public")));

// connection
mongoConnection("mongodb://localhost/blogify")
  .then(() => console.log("Connected To MongoDB"))
  .catch(() => console.log("Error Connecting To MongoDB"));

// static routes
app.get("/", (req, res) => res.redirect("/blogs"));
app.use("/blogs", checkForAuthentication, blogStaticRoutes);
app.use("/user", checkForAuthentication, userStaticRoutes);

// routes
app.use("/blogs", checkForAuthentication, blogRoutes);
app.use("/user", userRoutes);
app.use("/utils", utilRoute);

// server connection
app.listen(3000, () => console.log("Connnected To Server"));
