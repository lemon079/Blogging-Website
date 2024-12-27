import Blog from "../model/blog.js";

async function handleCreateBlog(req, res) {
  const { title, body } = req.body;
  await Blog.create({
    title,
    body,
    coverImageUrl: `/uploads/${req.file.filename}`,
    generatedBy: req.user._id,
  });
  return res.redirect("/blogs");
}

export { handleCreateBlog };
