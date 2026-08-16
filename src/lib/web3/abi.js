
const cache = new Map();

/**
 * ABIs are always read from the compiled Hardhat artifacts served out of public/.
 * They are never hardcoded, so the frontend can never drift from the contracts.
 */
export async function loadAbi(contractName) {
  if (cache.has(contractName)) return cache.get(contractName);

  const url = `/artifacts/contracts/${contractName}.sol/${contractName}.json`;
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(
      `[web3] ABI artifact not found at ${url}. Run "npm run compile" (or "npm run dev") to generate it.`
    );
  }

  const artifact = await response.json();
  if (!Array.isArray(artifact.abi)) {
    throw new Error(`[web3] Artifact at ${url} has no "abi" array — the compile output is invalid.`);
  }

  cache.set(contractName, artifact.abi);
  return artifact.abi;
}
