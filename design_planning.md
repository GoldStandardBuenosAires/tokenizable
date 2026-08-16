# Tokenizable — Design Planning Contract

## 1.1 Site Classification
EDITORIAL MARKETING — Web3 / DAO platform marketing site. Multi-page editorial scroll journey.
**Success:** visitor understands DAO-ownership vision, feels community sovereignty over corporate extraction, mints membership or joins waitlist.

## 1.2 Visual Metaphor (DNA)
**Shape:** HEXAGONAL NETWORK NODES — fragment and reform through scroll.
**Materials:** warm community paper colliding with cold chain glass.
**Transformation:** isolated nodes → connecting threads → constellations of community.

## 1.3 Colors
Source: BERLIN UNDERGROUND POSTERS × SCANDINAVIAN COMMUNITY HALLS.
- `ink` #0A0A0F — deep void, the chain
- `paper` #F5F1E8 — warm community parchment
- `spark` #FF5C28 — incandescent orange, human connection, CTA
- `signal` #6B7FFF — electric periwinkle, digital signature
- `ash` #1A1A22 — elevated dark for cards

**Fonts:** Space Grotesk (display), JetBrains Mono (chain tickers), Newsreader (editorial body).

## 1.4 Motion
**Character:** WEIGHTY MECHANICAL with ORGANIC EASING — cubic-bezier(0.65, 0, 0.35, 1), 400-600ms.
**Direction:** Vertical with horizontal scroll-velocity collisions.

## 1.5 Component Ledger
12 components fetched and used: floating-lines, spotlight-card, variable-proximity, shuffle, split-text, scroll-velocity, glowing-effect, click-spark, count-up, logo-loop, timeline, magnet.

## 1.6 Pages Built (7)
1. **Home** — Hero, ManifestoMarquee, OwnershipProof, FeaturesBento, TechStackMarquee, JoinCTA
2. **How It Works** — Steps flow, Treasury section, CTA
3. **Groups** — Categories, Groups grid (with safety tier badges), Host CTA
4. **Safety** — Tier gate interactive demo, Moderation Council, Four Principles
5. **Governance** — Stats, Distribution + Vote Weight Slider, Lifecycle, Active Proposals
6. **Roadmap** — Timeline (5 phases), Handoff statement
7. **Join** — Three tiers, Email waitlist, Community CTAs

## 2.1 Hero
- **HeroEntrance.jsx** — 4.4s hexagonal assembly + connecting lines (anime.js stagger from center).
- **Hero.jsx** — Cinematic video, gradient overlay for contrast, custom cursor, split-text headline reveal.

## 2.4 Custom Components (4 built)
- **ProposalTicker** — Live-feel DAO proposals scrolling (solves: makes governance tangible)
- **TreasuryGauge** — Animated allocation bars + counter (solves: trust through transparency)
- **SafetyTierGate** — Tab-switchable tier demo (solves: parents understand isolation)
- **VoteWeightSlider** — Interactive quadratic voting demo (solves: makes tokenomics concrete)

## 3.3 Uniqueness
1. Hexagonal node motif morphing across entire scroll journey
2. Live-feel ProposalTicker showing on-chain governance breathing
3<parameter name="filePath">design_planning.md continued

. Berlin underground × Scandinavian palette — orange spark over warm cream, escaping crypto purple

## Verification
- All 7 pages built with full editorial composition
- 17 fields enforced per section: story role, asymmetric grid (col-start-2), hex shape counterweights, edge tension via bleeds, vertical accents, animated backgrounds, MAGNETIC hover (useSpring-based), CRAFT details, scroll moments, continuous life (breathing/rotating hexes), section bridges, motif evolution
- Typography floor: text-lg+ everywhere, font-extralight default
- Parallax + cursor + scroll moments implemented
- No emojis, no banned fonts (Inter/Poppins absent)
- TEXT in grid columns 2-11, images bleed via absolute positioning
