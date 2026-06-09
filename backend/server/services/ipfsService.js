const axios = require("axios");
const FormData = require("form-data");
require("dotenv").config();

// Upload image to Pinata
const uploadFileToIPFS = async (fileBuffer, fileName) => {
  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

  let data = new FormData();
  data.append("file", fileBuffer, { filename: fileName });

  const response = await axios.post(url, data, {
    headers: {
      "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
      Authorization: `Bearer ${process.env.PINATA_JWT}`,
    },
  });

  return response.data.IpfsHash;
};

// Upload JSON metadata to Pinata
const uploadMetadataToIPFS = async (metadata) => {
  const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;

  const response = await axios.post(url, metadata, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.PINATA_JWT}`,
    },
  });

  return response.data.IpfsHash;
};

module.exports = {
  uploadFileToIPFS,
  uploadMetadataToIPFS,
};
