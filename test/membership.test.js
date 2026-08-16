
import chaiPkg from "chai";
import pkg from "hardhat";
import {
  deployEcosystem,
  signContributorApproval,
  signPermit,
  futureDeadline,
  TIER,
} from "./helpers/fixtures.js";

const { expect } = chaiPkg;
const { ethers } = pkg;

describe("TokenizableMembership (soulbound ERC-721)", () => {
  let ctx;

  beforeEach(async () => {
    ctx = await deployEcosystem();
  });

  it("is owned by the MintController, not the Factory or deployer", async () => {
    expect(await ctx.membership.owner()).to.equal(await ctx.controller.getAddress());
    expect(await ctx.governanceToken.owner()).to.equal(await ctx.controller.getAddress());
  });

  it("rejects direct mints from anyone other than the MintController", async () => {
    await expect(
      ctx.membership.connect(ctx.rogue).mint(ctx.rogue.address, TIER.FOUNDING, "ipfs://x")
    ).to.be.revertedWithCustomError(ctx.membership, "OwnableUnauthorizedAccount");

    await expect(
      ctx.governanceToken.connect(ctx.rogue).mint(ctx.rogue.address, 1n)
    ).to.be.revertedWithCustomError(ctx.governanceToken, "OwnableUnauthorizedAccount");
  });

  it("records the tier and mint timestamp for each mint path", async () => {
    const deadline = await futureDeadline();
    const spender = await ctx.controller.getAddress();

    const fSig = await signPermit({
      token: ctx.usdc,
      owner: ctx.alice,
      spender,
      value: ctx.foundingPrice,
      deadline,
    });
    await ctx.controller
      .connect(ctx.alice)
      .getFunction("mintFounding(address,uint256,uint256,uint8,bytes32,bytes32)")(
        await ctx.usdc.getAddress(),
        ctx.foundingPrice,
        deadline,
        fSig.v,
        fSig.r,
        fSig.s
      );

    const pSig = await signPermit({
      token: ctx.usdc,
      owner: ctx.bob,
      spender,
      value: ctx.patronPrice,
      deadline,
    });
    await ctx.controller
      .connect(ctx.bob)
      .getFunction("mintPatron(address,uint256,uint256,uint8,bytes32,bytes32)")(
        await ctx.usdc.getAddress(),
        ctx.patronPrice,
        deadline,
        pSig.v,
        pSig.r,
        pSig.s
      );

    const expiry = await futureDeadline();
    const signature = await signContributorApproval({
      controller: ctx.controller,
      signer: ctx.allowlistSigner,
      to: ctx.carol.address,
      nonce: 1n,
      expiry,
    });
    await ctx.controller.connect(ctx.carol).mintContributor(signature, 1n, expiry);

    const aliceToken = await ctx.membership.tokenOfMember(ctx.alice.address);
    const bobToken = await ctx.membership.tokenOfMember(ctx.bob.address);
    const carolToken = await ctx.membership.tokenOfMember(ctx.carol.address);

    const [aliceTier, aliceStamp] = await ctx.membership.membershipOf(aliceToken);
    const [bobTier] = await ctx.membership.membershipOf(bobToken);
    const [carolTier] = await ctx.membership.membershipOf(carolToken);

    expect(Number(aliceTier)).to.equal(TIER.FOUNDING);
    expect(Number(bobTier)).to.equal(TIER.PATRON);
    expect(Number(carolTier)).to.equal(TIER.CONTRIBUTOR);
    expect(aliceStamp).to.be.greaterThan(0n);

    expect(await ctx.membership.tokenURI(aliceToken)).to.contain("founding");
    expect(await ctx.membership.tokenURI(bobToken)).to.contain("patron");
    expect(await ctx.membership.tokenURI(carolToken)).to.contain("contributor");
  });

  it("reverts every transfer attempt with SoulboundTransferNotAllowed", async () => {
    const expiry = await futureDeadline();
    const signature = await signContributorApproval({
      controller: ctx.controller,
      signer: ctx.allowlistSigner,
      to: ctx.alice.address,
      nonce: 7n,
      expiry,
    });
    await ctx.controller.connect(ctx.alice).mintContributor(signature, 7n, expiry);
    const tokenId = await ctx.membership.tokenOfMember(ctx.alice.address);

    await expect(
      ctx.membership.connect(ctx.alice).transferFrom(ctx.alice.address, ctx.bob.address, tokenId)
    ).to.be.revertedWithCustomError(ctx.membership, "SoulboundTransferNotAllowed");

    await expect(
      ctx.membership
        .connect(ctx.alice)
        .getFunction("safeTransferFrom(address,address,uint256)")(
          ctx.alice.address,
          ctx.bob.address,
          tokenId
        )
    ).to.be.revertedWithCustomError(ctx.membership, "SoulboundTransferNotAllowed");

    await ctx.membership.connect(ctx.alice).approve(ctx.bob.address, tokenId);
    await expect(
      ctx.membership.connect(ctx.bob).transferFrom(ctx.alice.address, ctx.bob.address, tokenId)
    ).to.be.revertedWithCustomError(ctx.membership, "SoulboundTransferNotAllowed");

    expect(await ctx.membership.ownerOf(tokenId)).to.equal(ctx.alice.address);
  });

  it("gives TKN holders checkpointed voting power once delegated", async () => {
    const expiry = await futureDeadline();
    const signature = await signContributorApproval({
      controller: ctx.controller,
      signer: ctx.allowlistSigner,
      to: ctx.alice.address,
      nonce: 11n,
      expiry,
    });
    await ctx.controller.connect(ctx.alice).mintContributor(signature, 11n, expiry);

    expect(await ctx.governanceToken.balanceOf(ctx.alice.address)).to.equal(
      ethers.parseEther("500")
    );
    expect(await ctx.governanceToken.getVotes(ctx.alice.address)).to.equal(0n);

    await ctx.governanceToken.connect(ctx.alice).delegate(ctx.alice.address);
    expect(await ctx.governanceToken.getVotes(ctx.alice.address)).to.equal(
      ethers.parseEther("500")
    );
  });
});
