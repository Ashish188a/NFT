// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SimpleNFT is ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;

    // Price to mint (0.001 ETH)
    uint256 public mintPrice = 0.001 ether;

    constructor() ERC721("MarketplaceNFT", "MNFT") Ownable(msg.sender) {}

    // Mint new NFT
    function mint(address to, string memory uri) public payable returns (uint256) {
        require(msg.value >= mintPrice, "Not enough ETH sent");
        
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);

        // Refund extra ETH
        if (msg.value > mintPrice) {
            payable(msg.sender).transfer(msg.value - mintPrice);
        }

        return tokenId;
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
