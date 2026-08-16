
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20Permit} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

/// @title MockUSDC — TEST ONLY
/// @notice 6-decimal stablecoin with EIP-2612 `permit`, used to exercise the
///         single-transaction approve-and-pay path on the local Hardhat node.
///
///         DO NOT treat this as a production asset. The MintController takes the
///         stablecoin addresses as parameters (and exposes `setStablecoins`) so real
///         deployments point at the real tokens:
///           - Polygon mainnet USDC (Circle): 0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359
///           - Polygon mainnet USDT:          0xc2132D05D31c914a87C6611C10748AEb04B58e8F
///           - Polygon Amoy testnet USDC:     0x41E94Eb019C0762f9Bfcf9Fb1e58725BfB0e7582
contract MockUSDC is ERC20, ERC20Permit, Ownable {
    constructor(address initialOwner)
        ERC20("USD Coin", "USDC")
        ERC20Permit("USD Coin")
        Ownable(initialOwner)
    {}

    function decimals() public pure override returns (uint8) {
        return 6;
    }

    /// @dev Real Circle USDC exposes `version()`; we mirror it so the frontend can
    ///      build the correct EIP-712 permit domain for both mock and real tokens.
    function version() external pure returns (string memory) {
        return "1";
    }

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}
