import { Router } from "express";
import Blog from "../model/blog.js";
import Comment from "../model/comment.js";
const router = Router();


router.get("", async (req, res) => {
  const ALL_BLOGS = await Blog.find({}).sort({ CreatedAt: -1 });
  return res.render("blog", {
    user: req.user,
    Blogs: ALL_BLOGS,
  });
});

router.get("/add", (req, res) => {
  return res.render("addBlog", {
    user: req.user,
  });
});

router.get("/:id", async (req, res) => {
  const blogId = req.params.id;
  try {
    const blog = await Blog.findById({ _id: blogId }).populate("generatedBy");
    const ALL_COMMENTS = await Comment.find({ blogId: blogId }).populate(
      "generatedBy"
    );
    return res.render("singleBlog", {
      user: req.user,
      blog,
      comments: ALL_COMMENTS,
    });
  } catch (error) {
    return res.render("singleBlog", {
      error,
    });
  }
});

router.post("/comment/:id", async (req, res) => {
  const blogId = req.params.id;
  const userId = req.user._id;
  const { content } = req.body;
  await Comment.create({
    blogId: blogId,
    content: content,
    generatedBy: userId,
  });
  return res.redirect(`/${blogId}`);
});

export default router;
