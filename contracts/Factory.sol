// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// ERC-20 Standard Token
contract StandardERC20 is ERC20 {
    constructor(string memory name, string memory symbol, uint256 totalSupply) ERC20(name, symbol) {
        _mint(msg.sender, totalSupply); 
    }
}

// ERC-20 Ownable Token
contract OwnableERC20 is ERC20, Ownable(msg.sender) {
    constructor(string memory name, string memory symbol, uint256 totalSupply) ERC20(name, symbol) {
        _mint(msg.sender, totalSupply); 
    }
}

// ERC-20 Mintable Token
contract MintableERC20 is ERC20, Ownable(msg.sender) {
    constructor(string memory name, string memory symbol, uint256 totalSupply) ERC20(name, symbol) {
        _mint(msg.sender, totalSupply); 
    }

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}

// Factory Contract for deploying tokens
contract TokenFactory {

    address public owner;
    uint256 public constant TOKEN_CREATION_FEE = 5 ether;

    // Mapping to store user tokens by ID
    mapping(address => mapping(uint256 => address)) public userTokens;  
    mapping(address => uint256) public userTokenCount;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    // Get token creation fee
    function getTokenCreationFee() external pure returns (uint256) {
        return TOKEN_CREATION_FEE;
    }

    // Create Standard ERC-20 Token
    function createStandardERC20(string memory name, string memory symbol, uint256 totalSupply) 
        external 
        payable 
        returns (address) 
    {
        require(msg.value == TOKEN_CREATION_FEE, "Incorrect fee");

        StandardERC20 newToken = new StandardERC20(name, symbol, totalSupply);
        uint256 tokenId = userTokenCount[msg.sender];
        userTokens[msg.sender][tokenId] = address(newToken);
        userTokenCount[msg.sender]++;
        return address(newToken);
    }

    // Create Ownable ERC-20 Token
    function createOwnableERC20(string memory name, string memory symbol, uint256 totalSupply) 
        external 
        payable 
        returns (address) 
    {
        require(msg.value == TOKEN_CREATION_FEE, "Incorrect fee");

        OwnableERC20 newToken = new OwnableERC20(name, symbol, totalSupply);
        uint256 tokenId = userTokenCount[msg.sender];
        userTokens[msg.sender][tokenId] = address(newToken);
        userTokenCount[msg.sender]++;
        return address(newToken);
    }

    // Create Mintable ERC-20 Token
    function createMintableERC20(string memory name, string memory symbol, uint256 totalSupply) 
        external 
        payable 
        returns (address) 
    {
        require(msg.value == TOKEN_CREATION_FEE, "Incorrect fee");

        MintableERC20 newToken = new MintableERC20(name, symbol, totalSupply);
        uint256 tokenId = userTokenCount[msg.sender];
        userTokens[msg.sender][tokenId] = address(newToken);
        userTokenCount[msg.sender]++;
        return address(newToken);
    }

    // Get token by ID
    function getTokenById(uint256 tokenId) external view returns (address) {
        return userTokens[msg.sender][tokenId];
    }

    // Get all tokens created by the user
    function getAllUserTokens() external view returns (address[] memory) {
        uint256 tokenCount = userTokenCount[msg.sender];
        address[] memory tokens = new address[](tokenCount);

        for (uint256 i = 0; i < tokenCount; i++) {
            tokens[i] = userTokens[msg.sender][i];
        }

        return tokens;
    }
}
