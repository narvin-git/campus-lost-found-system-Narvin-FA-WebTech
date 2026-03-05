const express = require("express");
const router = express.Router();

const { register, login, setAdminPassword } = require("../controllers/auth.controller");

// register
router.post("/register", register);

// login
router.post("/login", login);

// one-time: set admin password hash in DB
router.post("/set-admin-password", setAdminPassword);

module.exports = router;