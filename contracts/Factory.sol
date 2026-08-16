
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import {TokenizableMembership} from "./TokenizableMembership.sol";
import {TokenizableGovernanceToken} from "./TokenizableGovernanceToken.sol";
import {MintController} from "./MintController.sol";
import {MockUSDC} from "./MockUSDC.sol";
import {MockUSDT} from "./MockUSDT.sol";

/// @title Factory
/// @notice Zero-argument factory that deploys and wires the entire Tokenizable
///         ecosystem in a single transaction, then hands every privileged role away
///         so the Factory itself retains no power.
contract Factory {
    struct Deployment {
        address membershipAddress;
        address governanceTokenAddress;
        address mintControllerAddress;
        address usdcAddress;
        address usdtAddress;
        address treasuryAddress;
        address allowlistSigner;
        uint256 foundingPriceUsd;
        uint256 patronPriceUsd;
        address factoryAddress;
    }

    /// @notice DAO treasury — Safe multisig, 2-of-2 threshold, Polygon.
    address public constant TREASURY = 0x1e376cF6C23E26CF99dFB297E79ebab071244EA4;

    /// @notice Placeholder Contributor allowlist signer. This MUST be rotated with
    ///         MintController.setAllowlistSigner(...) before any Contributor mint is
    ///         trusted — no signature produced by this address can ever be valid.
    address public constant PLACEHOLDER_ALLOWLIST_SIGNER =
        0x000000000000000000000000000000000000dEaD;

    Deployment private _deployment;
    bool private _deployed;

    constructor() {
        deployEcosystem();
    }

    function deployEcosystem() public {
        require(!_deployed, "Factory: already deployed");
        _deployed = true;

        address operator = msg.sender;

        TokenizableMembership membership = new TokenizableMembership(address(this));
        TokenizableGovernanceToken governanceToken = new TokenizableGovernanceToken(address(this));

        // Test-only stablecoins for the local node / testnet rehearsals. Real
        // deployments call MintController.setStablecoins with the Circle USDC and
        // USDT addresses for the target chain.
        MockUSDC usdc = new MockUSDC(operator);
        MockUSDT usdt = new MockUSDT(operator);

        MintController controller = new MintController(
            address(membership),
            address(governanceToken),
            address(usdc),
            address(usdt),
            TREASURY,
            PLACEHOLDER_ALLOWLIST_SIGNER,
            operator
        );

        // The controller must own both tokens so NFT + TKN issuance stays atomic.
        membership.transferOwnership(address(controller));
        governanceToken.transferOwnership(address(controller));

        _deployment = Deployment({
            membershipAddress: address(membership),
            governanceTokenAddress: address(governanceToken),
            mintControllerAddress: address(controller),
            usdcAddress: address(usdc),
            usdtAddress: address(usdt),
            treasuryAddress: TREASURY,
            allowlistSigner: PLACEHOLDER_ALLOWLIST_SIGNER,
            foundingPriceUsd: 72,
            patronPriceUsd: 1890,
            factoryAddress: address(this)
        });
    }

    function getDeployment() external view returns (Deployment memory) {
        return _deployment;
    }
}
