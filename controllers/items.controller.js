const pool = require("../db");
const sanitizeHtml = require("sanitize-html");

function clean(v) {
  return sanitizeHtml(String(v ?? ""), { allowedTags: [], allowedAttributes: {} }).trim();
}
function validCategory(c) {
  return c === "Lost" || c === "Found";
}
function validStatus(s) {
  return s === "Active" || s === "Claimed" || s === "Resolved";
}

exports.createItem = async (req, res, next) => {
  try {
    let { title, description, category, location, date, contact } = req.body;

    // Logged-in user id (owner)
    const userId = req.user.id;

    // Server-side validation (required)
    if (!title || !description || !category || !location || !date || !contact) {
      return res.status(400).json({ error: "All fields are required." });
    }
    if (!validCategory(category)) {
      return res.status(400).json({ error: "Category must be Lost or Found." });
    }

    // XSS prevention (sanitize)
    title = clean(title);
    description = clean(description);
    location = clean(location);
    contact = clean(contact);

    const [result] = await pool.execute(
      `INSERT INTO items (title, description, category, location, date, contact, status, user_id)
       VALUES (?, ?, ?, ?, ?, ?, 'Active', ?)`,
      [title, description, category, location, date, contact, userId] // parameterized => SQL injection prevention
    );

    res.status(201).json({ message: "Item created", id: result.insertId });
  } catch (err) {
    next(err);
  }
};

exports.listItems = async (req, res, next) => {
  try {
    const { category } = req.query;

    let sql = "SELECT * FROM items";
    const params = [];

    if (category && validCategory(category)) {
      sql += " WHERE category = ?";
      params.push(category);
    }

    sql += " ORDER BY created_at DESC";

    const [rows] = await pool.execute(sql, params);
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

exports.getItem = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ error: "Invalid id." });

    const [rows] = await pool.execute("SELECT * FROM items WHERE id = ?", [id]);
    if (rows.length === 0) return res.status(404).json({ error: "Item not found." });

    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    let { status } = req.body;

    if (!Number.isInteger(id)) return res.status(400).json({ error: "Invalid id." });

    // Check permission: owner OR admin
    const [rows] = await pool.execute("SELECT user_id FROM items WHERE id = ?", [id]);
    if (!rows.length) return res.status(404).json({ error: "Item not found." });

    const itemUserId = rows[0].user_id;
    const isAdmin = req.user?.role === "admin";
    const isOwner = itemUserId === req.user?.id;

    if (!isAdmin && !isOwner) {
      return res.status(403).json({ error: "Not allowed (owner or admin only)." });
    }

    status = clean(status);
    if (!validStatus(status)) {
      return res.status(400).json({ error: "Status must be Active, Claimed, or Resolved." });
    }

    const [result] = await pool.execute("UPDATE items SET status = ? WHERE id = ?", [status, id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: "Item not found." });

    res.json({ message: "Status updated" });
  } catch (err) {
    next(err);
  }
};

exports.deleteItem = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ error: "Invalid id." });

    // Check permission: owner OR admin
    const [rows] = await pool.execute("SELECT user_id FROM items WHERE id = ?", [id]);
    if (!rows.length) return res.status(404).json({ error: "Item not found." });

    const itemUserId = rows[0].user_id;
    const isAdmin = req.user?.role === "admin";
    const isOwner = itemUserId === req.user?.id;

    if (!isAdmin && !isOwner) {
      return res.status(403).json({ error: "Not allowed (owner or admin only)." });
    }

    const [result] = await pool.execute("DELETE FROM items WHERE id = ?", [id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: "Item not found." });

    res.json({ message: "Item deleted" });
  } catch (err) {
    next(err);
  }
};