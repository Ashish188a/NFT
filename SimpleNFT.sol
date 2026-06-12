// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SimpleNFT is ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;

    // Price to mint (0.001 ETH)
    uint256 public mintPrice = 0.001 ether;

    // Mapping from tokenId to its price
    mapping(uint256 => uint256) public tokenPrices;

    // Event for when an NFT is listed for sale
    event NFTListed(uint256 indexed tokenId, uint256 price);
    // Event for when an NFT is bought
    event NFTBought(uint256 indexed tokenId, address buyer, uint256 price);

    constructor() ERC721("MarketplaceNFT", "MNFT") Ownable(msg.sender) {}

    // Mint new NFT and optionally list it for sale
    function mint(address to, string memory uri, uint256 sellingPrice) public payable returns (uint256) {
        require(msg.value >= mintPrice, "Not enough ETH sent for mint fee");
        
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);

        if (sellingPrice > 0) {
            tokenPrices[tokenId] = sellingPrice;
            emit NFTListed(tokenId, sellingPrice);
        }

        // Refund extra ETH sent beyond the mint fee
        if (msg.value > mintPrice) {
            payable(msg.sender).transfer(msg.value - mintPrice);
        }

        return tokenId;
    }

    // List an NFT for sale
    function listForSale(uint256 tokenId, uint256 price) public {
        require(ownerOf(tokenId) == msg.sender, "Not the owner");
        require(price > 0, "Price must be greater than zero");
        
        tokenPrices[tokenId] = price;
        emit NFTListed(tokenId, price);
    }

    // Buy an NFT
    function buyNFT(uint256 tokenId) public payable {
        uint256 price = tokenPrices[tokenId];
        require(price > 0, "NFT not for sale");
        require(msg.value >= price, "Insufficient funds");

        address seller = ownerOf(tokenId);
        require(seller != msg.sender, "Buyer cannot be the seller");

        // Transfer funds to seller
        payable(seller).transfer(msg.value);
        
        // Transfer NFT to buyer
        _transfer(seller, msg.sender, tokenId);

        // Clear price
        tokenPrices[tokenId] = 0;

        emit NFTBought(tokenId, msg.sender, price);
    }

    // Withdraw ETH to owner wallet
    function withdraw() public onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    // Set new mint price
    function setMintPrice(uint256 _price) public onlyOwner {
        mintPrice = _price;
    }
}
