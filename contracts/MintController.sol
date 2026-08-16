
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {EIP712} from "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IERC20Permit} from "@openzeppelin/contracts/token/ERC20/extensions/IERC20Permit.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {VestingWallet} from "@openzeppelin/contracts/finance/VestingWallet.sol";

import {TokenizableMembership} from "./TokenizableMembership.sol";
import {TokenizableGovernanceToken} from "./TokenizableGovernanceToken.sol";

/// @title MintController
/// @notice Single entry point for the three membership mint paths. Owns the membership
///         NFT and the TKN token so NFT + TKN are always issued atomically.
///         Stablecoin payments are pulled straight to the DAO Safe treasury — funds
///         never rest in this contract.
contract MintController is Ownable, ReentrancyGuard, EIP712 {
    using SafeERC20 for IERC20;

    // --- pricing (USD, 6 decimals — USDC/USDT units) ---
    uint256 public constant FOUNDING_PRICE = 72e6; // $72
    uint256 public constant PATRON_PRICE = 1890e6; // $1,890

    // --- TKN allocations ---
    uint256 public constant FOUNDING_TKN = 500e18;
    uint256 public constant CONTRIBUTOR_TKN = 500e18;
    uint256 public constant PATRON_TKN = 10_000e18;
    uint64 public constant PATRON_VESTING_DURATION = 365 days;

    bytes32 private constant CONTRIBUTOR_APPROVAL_TYPEHASH =
        keccak256("ContributorApproval(address to,uint256 nonce,uint256 expiry)");

    TokenizableMembership public immutable membership;
    TokenizableGovernanceToken public immutable governanceToken;

    /// @notice DAO treasury (Safe multisig, 2-of-2) — every stablecoin payment lands here.
    address public immutable treasury;

    address public usdc;
    address public usdt;

    /// @notice Address authorised to sign Contributor allowlist approvals. Rotatable.
    address public allowlistSigner;

    mapping(uint256 => bool) public usedNonces;
    mapping(address => address) public vestingWalletOf;
    mapping(uint8 => string) public tierURI;

    error WrongPaymentAmount(uint256 expected, uint256 provided);
    error UnsupportedStablecoin(address token);
    error PermitNotSupported(address token);
    error NonceAlreadyUsed(uint256 nonce);
    error SignatureExpired(uint256 expiry);
    error InvalidSigner(address recovered);
    error ZeroAddress();
    error FundsRetained(uint256 amount);

    event FoundingMinted(address indexed member, uint256 tokenId, address stablecoin, uint256 amount);
    event PatronMinted(
        address indexed member,
        uint256 tokenId,
        address vestingWallet,
        address stablecoin,
        uint256 amount
    );
    event ContributorMinted(address indexed member, uint256 tokenId, uint256 nonce);
    event AllowlistSignerUpdated(address previousSigner, address newSigner);
    event StablecoinsUpdated(address usdc, address usdt);

    constructor(
        address membership_,
        address governanceToken_,
        address usdc_,
        address usdt_,
        address treasury_,
        address allowlistSigner_,
        address initialOwner
    ) Ownable(initialOwner) EIP712("TokenizableMintController", "1") {
        if (
            membership_ == address(0) ||
            governanceToken_ == address(0) ||
            usdc_ == address(0) ||
            usdt_ == address(0) ||
            treasury_ == address(0)
        ) revert ZeroAddress();

        membership = TokenizableMembership(membership_);
        governanceToken = TokenizableGovernanceToken(governanceToken_);
        usdc = usdc_;
        usdt = usdt_;
        treasury = treasury_;
        allowlistSigner = allowlistSigner_;

        tierURI[0] = "ipfs://tokenizable-membership/founding.json";
        tierURI[1] = "ipfs://tokenizable-membership/contributor.json";
        tierURI[2] = "ipfs://tokenizable-membership/patron.json";
    }

    // ---------------------------------------------------------------- founding

    /// @notice USDC path — EIP-2612 permit + pay in one transaction.
    function mintFounding(
        address stablecoin,
        uint256 amount,
        uint256 permitDeadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external nonReentrant returns (uint256 tokenId) {
        _collect(stablecoin, amount, FOUNDING_PRICE, true, permitDeadline, v, r, s);
        tokenId = _issue(msg.sender, 0, FOUNDING_TKN, msg.sender);
        emit FoundingMinted(msg.sender, tokenId, stablecoin, amount);
    }

    /// @notice USDT (or pre-approved USDC) path — caller has already approved this contract.
    function mintFounding(address stablecoin, uint256 amount)
        external
        nonReentrant
        returns (uint256 tokenId)
    {
        _collect(stablecoin, amount, FOUNDING_PRICE, false, 0, 0, bytes32(0), bytes32(0));
        tokenId = _issue(msg.sender, 0, FOUNDING_TKN, msg.sender);
        emit FoundingMinted(msg.sender, tokenId, stablecoin, amount);
    }

    // ------------------------------------------------------------------ patron

    function mintPatron(
        address stablecoin,
        uint256 amount,
        uint256 permitDeadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external nonReentrant returns (uint256 tokenId, address vestingWallet) {
        _collect(stablecoin, amount, PATRON_PRICE, true, permitDeadline, v, r, s);
        (tokenId, vestingWallet) = _issuePatron(stablecoin, amount);
    }

    function mintPatron(address stablecoin, uint256 amount)
        external
        nonReentrant
        returns (uint256 tokenId, address vestingWallet)
    {
        _collect(stablecoin, amount, PATRON_PRICE, false, 0, 0, bytes32(0), bytes32(0));
        (tokenId, vestingWallet) = _issuePatron(stablecoin, amount);
    }

    // ------------------------------------------------------------- contributor

    /// @notice Free mint, gated by an EIP-712 approval signed by `allowlistSigner`.
    ///         The approval is bound to the caller, single-use (nonce) and time-boxed.
    function mintContributor(bytes calldata signature, uint256 nonce, uint256 expiry)
        external
        nonReentrant
        returns (uint256 tokenId)
    {
        if (block.timestamp > expiry) revert SignatureExpired(expiry);
        if (usedNonces[nonce]) revert NonceAlreadyUsed(nonce);

        bytes32 structHash = keccak256(
            abi.encode(CONTRIBUTOR_APPROVAL_TYPEHASH, msg.sender, nonce, expiry)
        );
        address recovered = ECDSA.recover(_hashTypedDataV4(structHash), signature);
        if (recovered != allowlistSigner) revert InvalidSigner(recovered);

        usedNonces[nonce] = true;

        tokenId = _issue(msg.sender, 1, CONTRIBUTOR_TKN, msg.sender);
        emit ContributorMinted(msg.sender, tokenId, nonce);
    }

    // ------------------------------------------------------------------ admin

    function setAllowlistSigner(address newSigner) external onlyOwner {
        if (newSigner == address(0)) revert ZeroAddress();
        emit AllowlistSignerUpdated(allowlistSigner, newSigner);
        allowlistSigner = newSigner;
    }

    /// @notice Swap the mock/test stablecoins for the real Circle USDC and USDT addresses
    ///         after deploying to Amoy or Polygon mainnet.
    function setStablecoins(address usdc_, address usdt_) external onlyOwner {
        if (usdc_ == address(0) || usdt_ == address(0)) revert ZeroAddress();
        usdc = usdc_;
        usdt = usdt_;
        emit StablecoinsUpdated(usdc_, usdt_);
    }

    function setTierURI(uint8 tier, string calldata uri) external onlyOwner {
        tierURI[tier] = uri;
    }

    function contributorApprovalDigest(address to, uint256 nonce, uint256 expiry)
        external
        view
        returns (bytes32)
    {
        return
            _hashTypedDataV4(
                keccak256(abi.encode(CONTRIBUTOR_APPROVAL_TYPEHASH, to, nonce, expiry))
            );
    }

    // --------------------------------------------------------------- internals

    function _collect(
        address stablecoin,
        uint256 amount,
        uint256 price,
        bool usePermit,
        uint256 permitDeadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) private {
        if (stablecoin != usdc && stablecoin != usdt) revert UnsupportedStablecoin(stablecoin);
        if (amount != price) revert WrongPaymentAmount(price, amount);

        if (usePermit) {
            // Most USDT deployments do not implement EIP-2612.
            if (stablecoin != usdc) revert PermitNotSupported(stablecoin);
            IERC20Permit(stablecoin).permit(msg.sender, address(this), amount, permitDeadline, v, r, s);
        }

        // Straight to the Safe treasury — nothing accumulates here.
        IERC20(stablecoin).safeTransferFrom(msg.sender, treasury, amount);

        uint256 retained = IERC20(stablecoin).balanceOf(address(this));
        if (retained != 0) revert FundsRetained(retained);
    }

    function _issue(address to, uint8 tier, uint256 tknAmount, address tknRecipient)
        private
        returns (uint256 tokenId)
    {
        tokenId = membership.mint(to, tier, tierURI[tier]);
        governanceToken.mint(tknRecipient, tknAmount);
    }

    function _issuePatron(address stablecoin, uint256 amount)
        private
        returns (uint256 tokenId, address vestingWallet)
    {
        VestingWallet wallet = new VestingWallet(
            msg.sender,
            uint64(block.timestamp),
            PATRON_VESTING_DURATION
        );
        vestingWallet = address(wallet);
        vestingWalletOf[msg.sender] = vestingWallet;

        tokenId = _issue(msg.sender, 2, PATRON_TKN, vestingWallet);
        emit PatronMinted(msg.sender, tokenId, vestingWallet, stablecoin, amount);
    }
}
