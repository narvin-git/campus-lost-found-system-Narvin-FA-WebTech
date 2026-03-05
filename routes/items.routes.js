const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/items.controller");

// READ
router.get("/", ctrl.listItems);
router.get("/:id", ctrl.getItem);

// CREATE
router.post("/", ctrl.createItem);

// UPDATE
router.put("/:id/status", ctrl.updateStatus);

// DELETE
router.delete("/:id", ctrl.deleteItem);

module.exports = router;