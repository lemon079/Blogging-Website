import Blog from "../model/blog.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
const genAI = new GoogleGenerativeAI("AIzaSyDqKQmUoK2JQaLAXkxuUktLRHwAZ87NBmY");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function handleCreateBlog(req, res) {
  const { title, body } = req.body;

  await Blog.create({
    title,
    body,
    coverImageUrl: req.file
      ? `/uploads/${req.file.filename}`
      : "/images/default-blog.png",
    generatedBy: req.user._id,
  });
  return res.redirect("/blogs");
}

async function handleParaphrase(req, res) {
  const { content } = req.body;
  try {
    const result = await model.generateContent(
      content + "only one unique answer"
    );
    return res.json({ paraphrasedText: result.response.text() });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to paraphrase content" });
  }
}

async function handleGenerateContent(req, res) {
  const { content } = req.body;
  try {
    const result = await model.generateContent(
      `write a blog on ${content}. please avoid using any format. just plain text`
    );
    res.json({ generatedText: result.response.text() });
  } catch (error) {
    console.error("Error generating content:", error); // Log any errors
    res.status(500).json({ error: "Failed to generate content" });
  }
}

export const handleDeleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    await Blog.findByIdAndDelete(id);
    return res.redirect(`/user/profile/${req.user._id}`);
  } catch (error) {
    res.status(500).json({ message: "Error deleting blog" });
  }
};

export const getEditBlogPage = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);
    res.render("createBlog", { blog });
  } catch (error) {
    res.status(500).json({ message: "Error fetching blog for editing" });
  }
};

export const handleEditBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, body } = req.body;
    const updateData = {
      title,
      body,
    };
    if (req.file) {
      updateData.coverImageUrl = `/uploads/${req.file.filename}`;
    }
    await Blog.findByIdAndUpdate(id, updateData);
    return res.redirect(`/blogs/${id}`);
  } catch (error) {
    res.status(500).json({ message: "Error editing blog" });
  }
};

export { handleCreateBlog, handleParaphrase, handleGenerateContent };
