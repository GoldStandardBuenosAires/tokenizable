
// Hardhat configuration — ES Modules only.
// NOTE: we import hardhat-toolbox (gives us ethers v6, chai matchers, network helpers)
// but we NEVER import the "hardhat" package here, to avoid a circular dependency.
import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";

dotenv.config();

const AMOY_RPC_URL = process.env.AMOY_RPC_URL || "https://rpc-amoy.polygon.technology";
const POLYGON_RPC_URL = process.env.POLYGON_RPC_URL || "https://polygon-bor-rpc.publicnode.com";
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const liveAccounts = PRIVATE_KEY ? [PRIVATE_KEY] : [];

export default {
  solidity: {
    version: "0.8.30",
    settings: {
      // runs: 1 keeps the Factory runtime size as small as possible — the Factory
      // embeds the creation code of every child contract it deploys.
      optimizer: { enabled: true, runs: 1 },
      evmVersion: "prague",
    },
  },
  paths: {
    sources: "contracts",
    tests: "test",
    cache: "cache",
    // Artifacts live in public/ so the frontend can fetch ABIs at runtime
    // (both locally and once the static build is deployed).
    artifacts: "public/artifacts",
  },
  networks: {
    hardhat: {
      chainId: 31337,
      hardfork: "prague",
      blockGasLimit: 120_000_000,
      allowUnlimitedContractSize: true,
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
      blockGasLimit: 120_000_000,
      allowUnlimitedContractSize: true,
    },
    amoy: {
      url: AMOY_RPC_URL,
      chainId: 80002,
      accounts: liveAccounts,
    },
    polygon: {
      url: POLYGON_RPC_URL,
      chainId: 137,
      accounts: liveAccounts,
    },
  },
  mocha: {
    timeout: 180000,
  },
};
