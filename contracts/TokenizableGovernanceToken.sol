
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20Permit} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import {ERC20Votes} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import {Nonces} from "@openzeppelin/contracts/utils/Nonces.sol";

/// @title TKN — Tokenizable governance token
/// @notice ERC20Votes so Snapshot / Tally / on-chain Governors can read checkpointed
///         voting power. Only the MintController can mint, and it always mints
///         atomically with the membership NFT.
contract TokenizableGovernanceToken is ERC20, Ownable, ERC20Permit, ERC20Votes {
    constructor(address initialOwner)
        ERC20("Tokenizable Governance Token", "TKN")
        Ownable(initialOwner)
        ERC20Permit("Tokenizable Governance Token")
    {}

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    function _update(address from, address to, uint256 value)
        internal
        override(ERC20, ERC20Votes)
    {
        super._update(from, to, value);
    }

    function nonces(address owner)
        public
        view
        override(ERC20Permit, Nonces)
        returns (uint256)
    {
        return super.nonces(owner);
    }
}
