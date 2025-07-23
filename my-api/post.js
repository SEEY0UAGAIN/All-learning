const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const { post } = require("./user");
const prisma = new PrismaClient();

router.post("/", async (req, res) => {
  const { title, content, authorId } = req.body;
  try {
    const post = await prisma.post.create({
      data: {
        title,
        content,
        author: { connect: { id: authorId } },
      },
    });
    res.json(post);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/", async (req, res) => {
  const posts = await prisma.post.findMany({
    include: { author: true },
  });
  res.json(posts);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const post = await prisma.post.findUnique({
    where: { id: Number(id) },
    include: { author: true },
  });
  if (post) res.json(post);
  else res.status(404).json({ error: "Post no found" });
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { title, content, published } = req.body;
  try {
    const updated = await prisma.post.update({
      where: { id: Number(id) },
      data: { title, content, published },
    });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.post.delete({
      where: { id: Number(id) },
    });
    res.json({ message: "Post deleted" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
