import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoConnection from "./connection.js";
import blogRoutes from "./routes/blog.js";
import userRoutes from "./routes/user.js";
import staticRoutes from "./routes/staticRoutes.js";
import cookieParser from "cookie-parser";
import path from "path";
import { checkForAuthentication } from "./middleware/auth.js";
const app = express();

// ejs
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

//middlewares
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.resolve("./public")));

// connection
mongoConnection(process.env.MONGO_URL)
  .then(() => console.log("Connected To MongoDB"))
  .catch(() => console.log("Error Connecting To MongoDB"));

// static routes
app.get("/", (req, res) => res.redirect("/blogs"));
app.use("/blogs", checkForAuthentication, staticRoutes);

// routes
app.use("/blogs", checkForAuthentication, blogRoutes);
app.use("/auth", userRoutes);

// server connection
app.listen(process.env.PORT, () => console.log("Connnected To Server"));
