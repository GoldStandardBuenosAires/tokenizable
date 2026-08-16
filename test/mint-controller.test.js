
import chaiPkg from "chai";
import pkg from "hardhat";
import {
  deployEcosystem,
  signContributorApproval,
  signPermit,
  futureDeadline,
  SAFE_TREASURY,
} from "./helpers/fixtures.js";

const { expect } = chaiPkg;
const { ethers } = pkg;

describe("MintController", () => {
  let ctx;
  let controllerAddress;
  let usdcAddress;
  let usdtAddress;

  beforeEach(async () => {
    ctx = await deployEcosystem();
    controllerAddress = await ctx.controller.getAddress();
    usdcAddress = await ctx.usdc.getAddress();
    usdtAddress = await ctx.usdt.getAddress();
  });

  it("prices tiers in stablecoin units and routes to the Safe treasury", async () => {
    expect(ctx.foundingPrice).to.equal(72n * 10n ** 6n);
    expect(ctx.patronPrice).to.equal(1890n * 10n ** 6n);
    expect(await ctx.controller.treasury()).to.equal(SAFE_TREASURY);
  });

  describe("mintFounding", () => {
    it("accepts USDC via permit in a single transaction and forwards funds to the treasury", async () => {
      const deadline = await futureDeadline();
      const before = await ctx.usdc.balanceOf(SAFE_TREASURY);

      const sig = await signPermit({
        token: ctx.usdc,
        owner: ctx.alice,
        spender: controllerAddress,
        value: ctx.foundingPrice,
        deadline,
      });

      await ctx.controller
        .connect(ctx.alice)
        .getFunction("mintFounding(address,uint256,uint256,uint8,bytes32,bytes32)")(
          usdcAddress,
          ctx.foundingPrice,
          deadline,
          sig.v,
          sig.r,
          sig.s
        );

      expect(await ctx.usdc.balanceOf(SAFE_TREASURY)).to.equal(before + ctx.foundingPrice);
      expect(await ctx.usdc.balanceOf(controllerAddress)).to.equal(0n);
      expect(await ctx.membership.isMember(ctx.alice.address)).to.equal(true);
      expect(await ctx.governanceToken.balanceOf(ctx.alice.address)).to.equal(
        ethers.parseEther("500")
      );
    });

    it("accepts USDT through the two-step approve flow", async () => {
      await ctx.usdt.connect(ctx.alice).approve(controllerAddress, ctx.foundingPrice);
      const before = await ctx.usdt.balanceOf(SAFE_TREASURY);

      await ctx.controller
        .connect(ctx.alice)
        .getFunction("mintFounding(address,uint256)")(usdtAddress, ctx.foundingPrice);

      expect(await ctx.usdt.balanceOf(SAFE_TREASURY)).to.equal(before + ctx.foundingPrice);
      expect(await ctx.usdt.balanceOf(controllerAddress)).to.equal(0n);
      expect(await ctx.governanceToken.balanceOf(ctx.alice.address)).to.equal(
        ethers.parseEther("500")
      );
    });

    it("rejects USDT through the permit entry point", async () => {
      const deadline = await futureDeadline();
      await expect(
        ctx.controller
          .connect(ctx.alice)
          .getFunction("mintFounding(address,uint256,uint256,uint8,bytes32,bytes32)")(
            usdtAddress,
            ctx.foundingPrice,
            deadline,
            27,
            ethers.ZeroHash,
            ethers.ZeroHash
          )
      ).to.be.revertedWithCustomError(ctx.controller, "PermitNotSupported");
    });

    it("reverts on a wrong payment amount", async () => {
      const wrong = ctx.foundingPrice - 1n;
      await ctx.usdt.connect(ctx.alice).approve(controllerAddress, wrong);
      await expect(
        ctx.controller.connect(ctx.alice).getFunction("mintFounding(address,uint256)")(
          usdtAddress,
          wrong
        )
      ).to.be.revertedWithCustomError(ctx.controller, "WrongPaymentAmount");
    });

    it("reverts on an unsupported stablecoin", async () => {
      await expect(
        ctx.controller.connect(ctx.alice).getFunction("mintFounding(address,uint256)")(
          ctx.alice.address,
          ctx.foundingPrice
        )
      ).to.be.revertedWithCustomError(ctx.controller, "UnsupportedStablecoin");
    });

    it("reverts a second membership for the same wallet", async () => {
      await ctx.usdt.connect(ctx.alice).approve(controllerAddress, ctx.foundingPrice * 2n);
      await ctx.controller.connect(ctx.alice).getFunction("mintFounding(address,uint256)")(
        usdtAddress,
        ctx.foundingPrice
      );
      await expect(
        ctx.controller.connect(ctx.alice).getFunction("mintFounding(address,uint256)")(
          usdtAddress,
          ctx.foundingPrice
        )
      ).to.be.revertedWithCustomError(ctx.membership, "AlreadyMember");
    });
  });

  describe("mintPatron", () => {
    it("vests 10,000 TKN linearly over 365 days in a dedicated VestingWallet", async () => {
      const deadline = await futureDeadline();
      const sig = await signPermit({
        token: ctx.usdc,
        owner: ctx.bob,
        spender: controllerAddress,
        value: ctx.patronPrice,
        deadline,
      });

      const tx = await ctx.controller
        .connect(ctx.bob)
        .getFunction("mintPatron(address,uint256,uint256,uint8,bytes32,bytes32)")(
          usdcAddress,
          ctx.patronPrice,
          deadline,
          sig.v,
          sig.r,
          sig.s
        );
      await tx.wait();

      const vestingWallet = await ctx.controller.vestingWalletOf(ctx.bob.address);
      expect(vestingWallet).to.not.equal(ethers.ZeroAddress);

      expect(await ctx.governanceToken.balanceOf(vestingWallet)).to.equal(
        ethers.parseEther("10000")
      );
      expect(await ctx.governanceToken.balanceOf(ctx.bob.address)).to.equal(0n);
      expect(await ctx.usdc.balanceOf(SAFE_TREASURY)).to.equal(ctx.patronPrice);

      const wallet = await ethers.getContractAt("VestingWallet", vestingWallet);
      expect(await wallet.owner()).to.equal(ctx.bob.address);
      expect(await wallet.duration()).to.equal(365n * 24n * 60n * 60n);

      await ethers.provider.send("evm_increaseTime", [Number(365 * 24 * 60 * 60) / 2]);
      await ethers.provider.send("evm_mine", []);

      const releasable = await wallet.getFunction("releasable(address)")(
        await ctx.governanceToken.getAddress()
      );
      expect(releasable).to.be.greaterThan(ethers.parseEther("4900"));
      expect(releasable).to.be.lessThan(ethers.parseEther("5100"));
    });

    it("reverts when the patron price is wrong", async () => {
      await ctx.usdt.connect(ctx.bob).approve(controllerAddress, ctx.foundingPrice);
      await expect(
        ctx.controller.connect(ctx.bob).getFunction("mintPatron(address,uint256)")(
          usdtAddress,
          ctx.foundingPrice
        )
      ).to.be.revertedWithCustomError(ctx.controller, "WrongPaymentAmount");
    });
  });

  describe("mintContributor", () => {
    it("mints free with a valid EIP-712 allowlist signature", async () => {
      const expiry = await futureDeadline();
      const signature = await signContributorApproval({
        controller: ctx.controller,
        signer: ctx.allowlistSigner,
        to: ctx.carol.address,
        nonce: 42n,
        expiry,
      });

      await expect(ctx.controller.connect(ctx.carol).mintContributor(signature, 42n, expiry))
        .to.emit(ctx.controller, "ContributorMinted");

      expect(await ctx.membership.isMember(ctx.carol.address)).to.equal(true);
      expect(await ctx.governanceToken.balanceOf(ctx.carol.address)).to.equal(
        ethers.parseEther("500")
      );
      expect(await ctx.controller.usedNonces(42n)).to.equal(true);
    });

    it("rejects a signature from any address that is not the allowlist signer", async () => {
      const expiry = await futureDeadline();
      const signature = await signContributorApproval({
        controller: ctx.controller,
        signer: ctx.rogue,
        to: ctx.rogue.address,
        nonce: 1n,
        expiry,
      });
      await expect(
        ctx.controller.connect(ctx.rogue).mintContributor(signature, 1n, expiry)
      ).to.be.revertedWithCustomError(ctx.controller, "InvalidSigner");
    });

    it("rejects a signature issued for a different address", async () => {
      const expiry = await futureDeadline();
      const signature = await signContributorApproval({
        controller: ctx.controller,
        signer: ctx.allowlistSigner,
        to: ctx.carol.address,
        nonce: 5n,
        expiry,
      });
      await expect(
        ctx.controller.connect(ctx.rogue).mintContributor(signature, 5n, expiry)
      ).to.be.revertedWithCustomError(ctx.controller, "InvalidSigner");
    });

    it("rejects an expired approval", async () => {
      const block = await ethers.provider.getBlock("latest");
      const expiry = BigInt(block.timestamp - 1);
      const signature = await signContributorApproval({
        controller: ctx.controller,
        signer: ctx.allowlistSigner,
        to: ctx.carol.address,
        nonce: 9n,
        expiry,
      });
      await expect(
        ctx.controller.connect(ctx.carol).mintContributor(signature, 9n, expiry)
      ).to.be.revertedWithCustomError(ctx.controller, "SignatureExpired");
    });

    it("prevents nonce replay, even for a different wallet", async () => {
      const expiry = await futureDeadline();

      const first = await signContributorApproval({
        controller: ctx.controller,
        signer: ctx.allowlistSigner,
        to: ctx.carol.address,
        nonce: 77n,
        expiry,
      });
      await ctx.controller.connect(ctx.carol).mintContributor(first, 77n, expiry);

      const second = await signContributorApproval({
        controller: ctx.controller,
        signer: ctx.allowlistSigner,
        to: ctx.bob.address,
        nonce: 77n,
        expiry,
      });
      await expect(
        ctx.controller.connect(ctx.bob).mintContributor(second, 77n, expiry)
      ).to.be.revertedWithCustomError(ctx.controller, "NonceAlreadyUsed");
    });
  });

  describe("administration", () => {
    it("lets the owner rotate the allowlist signer and swap in real stablecoins", async () => {
      await ctx.controller.connect(ctx.deployer).setAllowlistSigner(ctx.bob.address);
      expect(await ctx.controller.allowlistSigner()).to.equal(ctx.bob.address);

      await ctx.controller
        .connect(ctx.deployer)
        .setStablecoins("0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359", "0xc2132D05D31c914a87C6611C10748AEb04B58e8F");
      expect(await ctx.controller.usdc()).to.equal("0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359");
      expect(await ctx.controller.usdt()).to.equal("0xc2132D05D31c914a87C6611C10748AEb04B58e8F");
    });

    it("blocks non-owners from administration", async () => {
      await expect(
        ctx.controller.connect(ctx.rogue).setAllowlistSigner(ctx.rogue.address)
      ).to.be.revertedWithCustomError(ctx.controller, "OwnableUnauthorizedAccount");
    });
  });
});
