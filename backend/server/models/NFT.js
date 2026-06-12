const mongoose = require("mongoose");

const NFTSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageURL: {
    type: String,
    required: true,
  },
  tokenURI: {
    type: String,
    required: true,
  },
  creatorAddress: {
    type: String,
    required: true,
    lowercase: true,
  },
  ownerAddress: {
    type: String,
    required: true,
    lowercase: true,
  },
  price: {
    type: String,
    default: "0.001",
  },
  isForSale: {
    type: Boolean,
    default: false,
  },
  tokenId: {
    type: Number,
  },
  transactionHash: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("NFT", NFTSchema);
