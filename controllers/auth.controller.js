const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db");

// helper
function isQiuEmail(email) {
  return typeof email === "string" && email.toLowerCase().endsWith("@qiu.edu.my");
}

async function register(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!isQiuEmail(email)) {
      return res.status(400).json({ error: "Only @qiu.edu.my emails are allowed" });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    const [existing] = await pool.execute("SELECT id FROM users WHERE email = ?", [email]);
    if (existing.length) return res.status(409).json({ error: "Email already registered" });

    const hash = await bcrypt.hash(password, 10);
    const [result] = await pool.execute(
      "INSERT INTO users (email, password_hash, role) VALUES (?, ?, 'user')",
      [email, hash]
    );

    return res.status(201).json({ message: "Registered", userId: result.insertId });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const [rows] = await pool.execute(
      "SELECT id, email, password_hash, role FROM users WHERE email = ?",
      [email]
    );
    if (!rows.length) return res.status(401).json({ error: "Invalid credentials" });

    const user = rows[0];
    const ok = await bcrypt.compare(password || "", user.password_hash);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    return res.json({
      message: "Logged in",
      token,
      user: { id: user.id, email: user.email, role: user.role }
    });
  } catch (err) {
    next(err);
  }
}

async function setAdminPassword(req, res, next) {
  try {
    const { email, password } = req.body;

    // safety: only allow setting password for admin email
    if (email !== "admin@qiu.edu.my") {
      return res.status(400).json({ error: "Only admin@qiu.edu.my allowed here" });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    const hash = await bcrypt.hash(password, 10);
    const [result] = await pool.execute(
      "UPDATE users SET password_hash = ? WHERE email = ? AND role='admin'",
      [hash, email]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Admin user not found" });
    }

    return res.json({ message: "Admin password updated" });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, setAdminPassword };