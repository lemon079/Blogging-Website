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

export { handleCreateBlog, handleParaphrase, handleGenerateContent };
