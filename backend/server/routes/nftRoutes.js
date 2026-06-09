const express = require("express");
const router = express.Router();
const multer = require("multer");
const nftController = require("../controllers/nftController");
const authMiddleware = require("../middleware/authMiddleware");

// Multer configuration for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// POST /api/nft/upload - Protected by JWT
router.post("/upload", authMiddleware, upload.single("image"), nftController.uploadNFT);

module.exports = router;
