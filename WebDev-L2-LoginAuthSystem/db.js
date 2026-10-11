const Database = require("better-sqlite3");

const db = new Database("users.db");

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
`);

function findUserByEmail(email) {
  return db.prepare("SELECT * FROM users WHERE email = ?").get(email);
}

function createUser(email, passwordHash) {
  return db
    .prepare("INSERT INTO users (email, password_hash) VALUES (?, ?)")
    .run(email, passwordHash);
}

module.exports = { findUserByEmail, createUser };