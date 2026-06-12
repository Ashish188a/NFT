const express = require("express");
const router = express.Router();
const multer = require("multer");
const nftController = require("../controllers/nftController");
const authMiddleware = require("../middleware/authMiddleware");

// Multer configuration for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// POST  - Upload to IPFS (Protected)
router.post("/upload", authMiddleware, upload.single("image"), nftController.uploadNFT);

// POST  - Save minted NFT to DB (Protected)
router.post("/save", authMiddleware, nftController.saveNFT);

// GET  - Get NFTs created by address (Public)
router.get("/created/:address", nftController.getCreatedNFTs);

// GET  - Get all NFTs (Public)
router.get("/all", nftController.getAllNFTs);

// POST  - Update owner after buy (Protected)
router.post("/purchase", authMiddleware, nftController.purchaseNFT);

// POST  - List NFT for sale (Protected)
router.post("/list", authMiddleware, nftController.listNFT);

module.exports = router;
