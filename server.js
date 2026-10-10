require("dotenv").config();
const path = require("path");
const express = require("express");
const session = require("express-session");
const helmet = require("helmet");
const { requirePage } = require("./middleware/requireAuth");

const app = express();

app.use(helmet());
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, sameSite: "lax", maxAge: 1000 * 60 * 60 },
  })
);

app.use("/api", require("./routes/auth"));

app.get("/dashboard", requirePage, (req, res) => {
  res.set("Cache-Control", "no-store");
  res.sendFile(path.join(__dirname, "views", "dashboard.html"));
});

app.get("/", (req, res) => res.redirect("/login.html"));

app.use(express.static("public"));

app.listen(3000, () => {
  console.log("Running on http://localhost:3000");
});