# tokenizable
The platform belongs to the room. A DAO-governed alternative to Meetup. Hold a membership NFT, vote on fees, elect moderators, propose changes. No board. No exit liquidity event. Just the community that shows up.
# Tokenizable

**The platform belongs to the room.**

A DAO-governed alternative to Meetup. Hold a membership NFT, vote on fees, elect moderators, propose changes. No board. No exit liquidity event. Just the community that shows up.

---

## What this is

Meetup's model puts every group, every member list, and every event history behind one organizer's account. If they leave, sell, or get suspended, the community goes with them. Tokenizable replaces that single point of failure with collective ownership: membership is a token, moderation is elected, and the treasury is a multisig — not a company balance sheet.

## How it works

**Membership**
- Mint a membership NFT (soulbound — non-transferable, tied to identity) in USDC/USDT on Polygon
- Three tiers: **Founding Member** ($75, 500 TKN), **Contributor** (free, signature-gated), **Patron** ($1,890, 10,000+ TKN vested over 1 year)
- Minting the NFT also grants **TKN**, a transferable ERC20Votes governance token — vote on platform fees, policy, and roadmap

**Groups → Rooms → Events**
- **Groups** are persistent communities, collectively owned by 2–3 elected stewards rather than a single organizer. If all stewards go inactive, the group enters an on-chain-visible election state — it never disappears with its owner.
- **Rooms** are persistent forum/chat channels inside a Group — day-to-day community, not just event logistics.
- **Events** are scheduled, RSVP-based gatherings tied to a Group, the same core mechanic as Meetup.
- Group creation requires holding TKN — no $30–55/mo organizer subscription paywall.

**Safety, structurally**
- Every Group carries a safety tier — Family-friendly, All-ages, or Adult-only — enforced at the data model level, not left to per-group self-policing.
- Adult-only spaces require a one-time platform-level age attestation and are excluded from default discovery until verified.
- Reports route to a centralized Tokenizable Discord for platform-wide safety escalation, with resolutions logged transparently. Groups can optionally bridge their own Discord for real-time chat.

**Governance & treasury**
- Platform treasury is a 2-of-2 Safe multisig on Polygon — no single signer, no company account.
- Fee changes, moderation policy, and roadmap decisions are TKN-holder votes, not board decisions.

## Tech stack

| Layer | Choice |
|---|---|
| Frontend | React + Vite |
| Wallets | Privy (embedded, email-first) + RainbowKit/wagmi |
| Contracts | Solidity, Hardhat, OpenZeppelin (ERC-721 soulbound, ERC20Votes, VestingWallet) |
| Chain | Polygon (Amoy testnet → mainnet) |
| Treasury | Safe (multisig) |
| Groups/Rooms/Events | Postgres via Supabase |
| Identity | ENS (`tokenizable.eth`) alongside standard DNS |
| Hosting | Cloudflare |

## Status

🚧 **Active development — pre-launch.**

- [x] Smart contract architecture finalized (membership NFT + governance token)
- [x] Treasury multisig deployed and tested on Polygon
- [x] Wallet auth (Privy + RainbowKit) integrated
- [x] Groups/Rooms/Events data model spec complete
- [ ] Groups/Rooms/Events live on Supabase (in progress)
- [ ] Contracts on Polygon Amoy testnet
- [ ] Mint flow enabled (currently disabled pending contract testing)
- [ ] TKN-gated Group creation (post-token-launch)

## Build sequencing

The web layer (Groups, Rooms, Events) ships first on a standard Postgres stack — no wallet or token required to use the core community features. Token-gating for Group creation, and full on-chain steward governance, land once the contracts are live on mainnet. The two tracks develop in parallel and don't block each other.

## Philosophy

No corporate extraction. No Series B. No exit. The people who show up own what they build — that's the whole premise, and it's enforced in the contracts and the data model, not just the marketing copy.

## License

_TBD_

## Contributing

_TBD — contribution guidelines coming as the platform nears public testnet._
