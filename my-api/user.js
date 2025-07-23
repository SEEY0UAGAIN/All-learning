const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

router.get("/users", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

router.post("/users", async (req, res) => {
  const { name, email, age } = req.body;
  const newUser = await prisma.user.create({
    data: { name, email, age },
  });
  res.status(201).json(newUser);
});

router.put("/users/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { name, email, age } = req.body;
  try {
    const updateUser = await prisma.user.update({
      where: { id },
      data: { name, email, age },
    });
    res.json(updateUser);
  } catch (error) {
    res.status(404).json({ message: "User not found" });
  }
});

router.delete("/users/:id", async (req, res) => {
  const id = Number(req.params.id);
  await prisma.user.delete({ where: { id } });
  res.json({ message: "User deleted " });
});

module.exports = router;
