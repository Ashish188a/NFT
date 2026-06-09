const ipfsService = require("../services/ipfsService");

// Upload image and metadata to IPFS
const uploadNFT = async (req, res) => {
  try {
    const { name, description } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No image file provided" });
    }

    // 1. Upload image to IPFS
    const imageCID = await ipfsService.uploadFileToIPFS(file.buffer, file.originalname);
    const imageURL = `https://gateway.pinata.cloud/ipfs/${imageCID}`;

    // 2. Prepare metadata
    const metadata = {
      name,
      description,
      image: imageURL,
      attributes: [], 
    };

    // 3. Upload metadata to IPFS
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

module.exports = {
  uploadNFT,
};
