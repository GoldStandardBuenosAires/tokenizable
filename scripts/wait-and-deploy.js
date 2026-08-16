
import { spawn } from "node:child_process";

const RPC_URL = "http://127.0.0.1:8545";
const MAX_ATTEMPTS = 90;
const npx = process.platform === "win32" ? "npx.cmd" : "npx";

async function rpcIsUp() {
  try {
    const response = await fetch(RPC_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "eth_chainId", params: [] }),
    });
    if (!response.ok) return false;
    const json = await response.json();
    return Boolean(json?.result);
  } catch {
    return false;
  }
}

async function waitForChain() {
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    if (await rpcIsUp()) {
      console.log(`[deploy] Hardhat node is up on ${RPC_URL}`);
      return true;
    }
    if (attempt % 5 === 0) {
      console.log(`[deploy] waiting for the Hardhat node... (${attempt}/${MAX_ATTEMPTS})`);
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  return false;
}

const ready = await waitForChain();
if (!ready) {
  throw new Error(
    `[deploy] Hardhat node never became reachable on ${RPC_URL}. Contracts were not deployed.`
  );
}

const child = spawn(npx, ["hardhat", "run", "scripts/deploy.js", "--network", "localhost"], {
  stdio: "inherit",
  env: process.env,
});

child.on("exit", (code) => {
  process.exit(code ?? 0);
});
