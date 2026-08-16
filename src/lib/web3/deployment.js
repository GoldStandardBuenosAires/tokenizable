
import { isProductionRuntime } from './networks';

const REQUIRED_FIELDS = [
  'membershipAddress',
  'governanceTokenAddress',
  'mintControllerAddress',
  'usdcAddress',
  'usdtAddress',
  'treasuryAddress',
  'chainId',
];

let cached = null;
let inFlight = null;

async function fetchDeployment() {
  const production = isProductionRuntime();
  const file = production ? '/deployment.json' : '/local-deployment.json';

  const response = await fetch(file, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(
      production
        ? `[web3] ${file} is missing. Deploy the contracts to a live network first (Preview -> Deploy Contracts).`
        : `[web3] ${file} is missing. Start the project with "npm run dev" so the Hardhat node boots and the contracts deploy.`
    );
  }

  const json = await response.json();
  for (const field of REQUIRED_FIELDS) {
    if (json[field] === undefined || json[field] === null || json[field] === '') {
      throw new Error(`[web3] ${file} is missing the required field "${field}".`);
    }
  }

  return { ...json, chainId: Number(json.chainId) };
}

export async function loadDeployment() {
  if (cached) return cached;
  if (!inFlight) {
    inFlight = fetchDeployment()
      .then((data) => {
        cached = data;
        inFlight = null;
        return data;
      })
      .catch((error) => {
        inFlight = null;
        throw error;
      });
  }
  return inFlight;
}
