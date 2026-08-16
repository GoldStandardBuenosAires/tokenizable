
import pkg from "hardhat";

const { ethers } = pkg;

export const SAFE_TREASURY = "0x1e376cF6C23E26CF99dFB297E79ebab071244EA4";
export const PLACEHOLDER_SIGNER = "0x000000000000000000000000000000000000dEaD";

export const TIER = { FOUNDING: 0, CONTRIBUTOR: 1, PATRON: 2 };

export async function deployEcosystem() {
  const [deployer, alice, bob, carol, allowlistSigner, rogue] = await ethers.getSigners();

  const FactoryArtifact = await ethers.getContractFactory("Factory");
  const factory = await FactoryArtifact.deploy();
  await factory.waitForDeployment();

  const d = await factory.getDeployment();

  const membership = await ethers.getContractAt("TokenizableMembership", d.membershipAddress);
  const governanceToken = await ethers.getContractAt("TokenizableGovernanceToken", d.governanceTokenAddress);
  const controller = await ethers.getContractAt("MintController", d.mintControllerAddress);
  const usdc = await ethers.getContractAt("MockUSDC", d.usdcAddress);
  const usdt = await ethers.getContractAt("MockUSDT", d.usdtAddress);

  await (await controller.connect(deployer).setAllowlistSigner(allowlistSigner.address)).wait();

  const foundingPrice = await controller.FOUNDING_PRICE();
  const patronPrice = await controller.PATRON_PRICE();

  const funding = patronPrice * 4n;
  for (const account of [alice, bob, carol]) {
    await (await usdc.connect(deployer).mint(account.address, funding)).wait();
    await (await usdt.connect(deployer).mint(account.address, funding)).wait();
  }

  return {
    deployer,
    alice,
    bob,
    carol,
    allowlistSigner,
    rogue,
    factory,
    membership,
    governanceToken,
    controller,
    usdc,
    usdt,
    deployment: d,
    foundingPrice,
    patronPrice,
  };
}

export async function signPermit({ token, owner, spender, value, deadline }) {
  const network = await owner.provider.getNetwork();
  const domain = {
    name: await token.name(),
    version: "1",
    chainId: network.chainId,
    verifyingContract: await token.getAddress(),
  };
  const types = {
    Permit: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
      { name: "value", type: "uint256" },
      { name: "nonce", type: "uint256" },
      { name: "deadline", type: "uint256" },
    ],
  };
  const message = {
    owner: owner.address,
    spender,
    value,
    nonce: await token.nonces(owner.address),
    deadline,
  };
  const raw = await owner.signTypedData(domain, types, message);
  return ethers.Signature.from(raw);
}

export async function signContributorApproval({ controller, signer, to, nonce, expiry }) {
  const network = await signer.provider.getNetwork();
  const domain = {
    name: "TokenizableMintController",
    version: "1",
    chainId: network.chainId,
    verifyingContract: await controller.getAddress(),
  };
  const types = {
    ContributorApproval: [
      { name: "to", type: "address" },
      { name: "nonce", type: "uint256" },
      { name: "expiry", type: "uint256" },
    ],
  };
  return signer.signTypedData(domain, types, { to, nonce, expiry });
}

export async function futureDeadline(seconds = 3600) {
  const block = await ethers.provider.getBlock("latest");
  return BigInt(block.timestamp + seconds);
}
