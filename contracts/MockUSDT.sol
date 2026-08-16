
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/// @title MockUSDT — TEST ONLY
/// @notice 6-decimal stablecoin WITHOUT EIP-2612 permit, deliberately mimicking real
///         USDT so the two-step approve -> transferFrom flow is exercised locally.
///         Polygon Amoy has no official USDT deployment, hence this mock.
///
///         Production addresses (set via MintController.setStablecoins):
///           - Polygon mainnet USDT: 0xc2132D05D31c914a87C6611C10748AEb04B58e8F
contract MockUSDT is ERC20, Ownable {
    constructor(address initialOwner) ERC20("Tether USD", "USDT") Ownable(initialOwner) {}

    function decimals() public pure override returns (uint8) {
        return 6;
    }

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}
