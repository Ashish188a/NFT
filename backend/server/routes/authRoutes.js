const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
    register,
    login,
    saveWalletAddress
} = require("../controllers/authController");

router.post("/register", register);

router.post("/login", login);

router.put("/wallet", authMiddleware, saveWalletAddress);

module.exports = router;