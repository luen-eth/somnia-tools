// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERC20 {
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
}

contract TokenMultiSender {
    address public owner;
    uint256 public feeInWei; 

    constructor() {
        owner = msg.sender;
        feeInWei = 5 ether;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    modifier chargeFee() {
        require(msg.value >= feeInWei, "Insufficient fee");
        payable(owner).transfer(msg.value); 
        _;
    }

    function setFee(uint256 _feeInWei) external onlyOwner {
        feeInWei = _feeInWei;
    }

    function getFee() external view returns (uint256) {
        return feeInWei;
    }

    function sendSameAmount(
        address token,
        address[] calldata recipients,
        uint256 amount
    ) external payable chargeFee {
        for (uint256 i = 0; i < recipients.length; i++) {
            require(
                IERC20(token).transferFrom(msg.sender, recipients[i], amount),
                "Transfer failed"
            );
        }
    }

    function sendDifferentAmounts(
        address token,
        address[] calldata recipients,
        uint256[] calldata amounts
    ) external payable chargeFee {
        require(recipients.length == amounts.length, "Array length mismatch");

        for (uint256 i = 0; i < recipients.length; i++) {
            require(
                IERC20(token).transferFrom(msg.sender, recipients[i], amounts[i]),
                "Transfer failed"
            );
        }
    }

    function withdrawStuckETH() external onlyOwner {
        payable(owner).transfer(address(this).balance);
    }

    function updateOwner(address newOwner) external onlyOwner {
        owner = newOwner;
    }
}
