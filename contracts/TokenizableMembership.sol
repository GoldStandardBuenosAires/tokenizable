
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

/// @title Tokenizable Membership
/// @notice Soulbound (non-transferable) ERC-721. One membership per wallet, three tiers.
///         Minting is restricted to the MintController, which owns this contract.
contract TokenizableMembership is ERC721, ERC721URIStorage, Ownable {
    enum Tier {
        Founding,
        Contributor,
        Patron
    }

    struct Membership {
        Tier tier;
        uint64 mintedAt;
    }

    error SoulboundTransferNotAllowed();
    error AlreadyMember(address member);
    error InvalidTier(uint8 tier);
    error UnknownToken(uint256 tokenId);

    uint256 private _nextTokenId = 1;

    mapping(uint256 => Membership) private _memberships;

    /// @notice tokenId held by a member; 0 means "not a member".
    mapping(address => uint256) public tokenOfMember;

    event MembershipMinted(address indexed to, uint256 indexed tokenId, Tier tier, uint64 mintedAt);

    constructor(address initialOwner)
        ERC721("Tokenizable Membership", "TKNM")
        Ownable(initialOwner)
    {}

    function mint(address to, uint8 tier, string memory uri) external onlyOwner returns (uint256) {
        if (tier > uint8(Tier.Patron)) revert InvalidTier(tier);
        if (tokenOfMember[to] != 0) revert AlreadyMember(to);

        uint256 tokenId = _nextTokenId++;
        uint64 mintedAt = uint64(block.timestamp);

        _memberships[tokenId] = Membership({tier: Tier(tier), mintedAt: mintedAt});
        tokenOfMember[to] = tokenId;

        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);

        emit MembershipMinted(to, tokenId, Tier(tier), mintedAt);
        return tokenId;
    }

    function membershipOf(uint256 tokenId) external view returns (Tier tier, uint64 mintedAt) {
        if (_ownerOf(tokenId) == address(0)) revert UnknownToken(tokenId);
        Membership memory m = _memberships[tokenId];
        return (m.tier, m.mintedAt);
    }

    function isMember(address account) external view returns (bool) {
        return tokenOfMember[account] != 0;
    }

    function totalMinted() external view returns (uint256) {
        return _nextTokenId - 1;
    }

    /// @dev Soulbound enforcement (OpenZeppelin v5 hook): mints (from == 0) and burns
    ///      (to == 0) are allowed, every wallet-to-wallet transfer reverts.
    function _update(address to, uint256 tokenId, address auth)
        internal
        override
        returns (address)
    {
        address from = _ownerOf(tokenId);
        if (from != address(0) && to != address(0)) revert SoulboundTransferNotAllowed();
        return super._update(to, tokenId, auth);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
