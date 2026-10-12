const express = require("express");
const bcrypt = require("bcrypt");
const { findUserByEmail, createUser } = require("../db");
const { requireApi } = require("../middleware/requireAuth");

const router = express.Router();

router.post("/register", async (req, res) => {
  const email = (req.body.email || "").trim().toLowerCase();
  const password = req.body.password || "";

  if (!email || !password) {
    return res.status(400).json({ error: "Please fill in all fields." });
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({ error: "Enter a valid email address." });
  }
  if (password.length < 8) {
    return res.status(400).json({ error: "Password must be at least 8 characters." });
  }
  if (!/\d/.test(password)) {
    return res.status(400).json({ error: "Password must have at least 1 number." });
  }
  if (findUserByEmail(email)) {
    return res.status(409).json({ error: "An account with this email already exists." });
  }

  const hash = await bcrypt.hash(password, 10);
  createUser(email, hash);

  res.status(201).json({ message: "Account created." });
});

router.post("/login", async (req, res) => {
  const email = (req.body.email || "").trim().toLowerCase();
  const password = req.body.password || "";

  if (!email || !password) {
    return res.status(400).json({ error: "Please fill in all fields." });
  }

  const user = findUserByEmail(email);
  const passwordOk = user && (await bcrypt.compare(password, user.password_hash));

  if (!passwordOk) {
    return res.status(401).json({ error: "Invalid email or password." });
  }

  req.session.userId = user.id;
  req.session.email = user.email;

  res.json({ message: "Login successful." });
});

router.get("/me", requireApi, (req, res) => {
  res.json({ email: req.session.email });
});

router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.json({ message: "Logged out." });
  });
});

module.exports = router;