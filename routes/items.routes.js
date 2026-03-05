const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/items.controller");
const { requireAuth } = require("../middleware/auth.middleware");

// READ
router.get("/", ctrl.listItems);
router.get("/:id", ctrl.getItem);

// CREATE
router.post("/", requireAuth, ctrl.createItem);

// UPDATE
router.put("/:id/status", requireAuth, ctrl.updateStatus);

// DELETE
router.delete("/:id", requireAuth, ctrl.deleteItem);

module.exports = router;