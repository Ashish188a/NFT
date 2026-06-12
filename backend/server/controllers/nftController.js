const ipfsService = require("../services/ipfsService");
const NFT = require("../models/NFT");

// Upload image and metadata to IPFS
const uploadNFT = async (req, res) => {
  try {
    const { name, description } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No image file provided" });
    }

    // Upload image to IPFS
    const imageCID = await ipfsService.uploadFileToIPFS(file.buffer, file.originalname);
    const imageURL = `https://gateway.pinata.cloud/ipfs/${imageCID}`;

    // Prepare metadata
    const metadata = {
      name,
      description,
      image: imageURL,
      attributes: [], 
    };

    // Upload metadata to IPFS
    const metadataCID = await ipfsService.uploadMetadataToIPFS(metadata);

    res.status(200).json({
      success: true,
      tokenURI: `ipfs://${metadataCID}`,
      imageURL: imageURL,
      metadataCID: metadataCID,
    });
  } catch (error) {
    console.error("Error in uploadNFT:", error);
    res.status(500).json({
      success: false,
      message: "Failed to upload to IPFS",
      error: error.message,
    });
  }
};

// Save NFT to database
const saveNFT = async (req, res) => {
  try {
    const { name, description, imageURL, tokenURI, creatorAddress, transactionHash, price, tokenId } = req.body;

    const newNFT = new NFT({
      name,
      description,
      imageURL,
      tokenURI,
      creatorAddress,
      ownerAddress: creatorAddress,
      transactionHash,
      price: price || "0.001",
      tokenId,
      isForSale: true
    });

    await newNFT.save();

    res.status(201).json({
      success: true,
      message: "NFT saved to database",
      nft: newNFT
    });
  } catch (error) {
    console.error("Error in saveNFT:", error);
    res.status(500).json({
      success: false,
      message: "Failed to save NFT",
      error: error.message
    });
  }
};

// Purchase an NFT and Update in database
const purchaseNFT = async (req, res) => {
  try {
    const { tokenId, newOwner, transactionHash } = req.body;
    
    const nft = await NFT.findOne({ tokenId });
    if (!nft) {
      return res.status(404).json({ message: "NFT not found" });
    }

    nft.ownerAddress = newOwner.toLowerCase();
    nft.isForSale = false;
    nft.transactionHash = transactionHash;
    
    await nft.save();

    res.status(200).json({
      success: true,
      message: "NFT owner updated in database",
      nft
    });
  } catch (error) {
    console.error("Error in purchaseNFT:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update NFT owner",
      error: error.message
    });
  }
};

// List NFT for sale
const listNFT = async (req, res) => {
  try {
    const { tokenId, price } = req.body;
    const nft = await NFT.findOne({ tokenId });
    
    if (!nft) return res.status(404).json({ message: "NFT not found" });
    
    nft.price = price;
    nft.isForSale = true;
    await nft.save();

    res.status(200).json({
      success: true,
      message: "NFT listed for sale",
      nft
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get NFTs created by the users
const getCreatedNFTs = async (req, res) => {
  try {
    const { address } = req.params;
    const nfts = await NFT.find({ creatorAddress: address.toLowerCase() }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      nfts
    });
  } catch (error) {
    console.error("Error in getCreatedNFTs:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch created NFTs",
      error: error.message
    });
  }
};

// Getting all NFTs from the database
const getAllNFTs = async (req, res) => {
  try {
    const nfts = await NFT.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      nfts
    });
  } catch (error) {
    console.error("Error in getAllNFTs:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch all NFTs",
      error: error.message
    });
  }
};

module.exports = {
  uploadNFT,
  saveNFT,
  getCreatedNFTs,
  getAllNFTs,
  purchaseNFT,
  listNFT
};
