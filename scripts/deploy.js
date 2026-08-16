
import fs from "node:fs";
import path from "node:path";
import pkg from "hardhat";

const { ethers, network } = pkg;

function serializeData(data) {
  const out = {};
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === "bigint") {
      out[key] = value.toString();
    } else if (Array.isArray(value)) {
      out[key] = value.map((v) => (typeof v === "bigint" ? v.toString() : v));
    } else {
      out[key] = value;
    }
  }
  return out;
}

async function main() {
  const [deployer] = await ethers.getSigners();
  const chain = await ethers.provider.getNetwork();
  const isLocalhost = network.name === "localhost" || network.name === "hardhat";

  console.log("──────────────────────────────────────────────────────────────");
  console.log(` Tokenizable ecosystem deploy`);
  console.log(` network : ${network.name} (chainId ${chain.chainId})`);
  console.log(` deployer: ${deployer.address}`);
  console.log("──────────────────────────────────────────────────────────────");

  const FactoryFactory = await ethers.getContractFactory("Factory");

  const deployTx = await FactoryFactory.getDeployTransaction();
  const estimatedGas = await ethers.provider.estimateGas({
    ...deployTx,
    from: deployer.address,
  });
  console.log(` estimated gas: ${estimatedGas.toString()}`);

  const overrides = isLocalhost ? { gasLimit: (estimatedGas * 120n) / 100n } : {};
  const factory = await FactoryFactory.deploy(overrides);
  await factory.waitForDeployment();

  const factoryAddress = await factory.getAddress();
  console.log(` Factory deployed at ${factoryAddress}`);

  const getDeploymentFragment = factory.interface.getFunction("getDeployment");
  const outputComponents = getDeploymentFragment.outputs[0].components;
  const fieldNames = outputComponents.map((component) => component.name);

  const deploymentData = await factory.getDeployment();

  const named = {};
  for (let i = 0; i < fieldNames.length; i += 1) {
    named[fieldNames[i]] = deploymentData[i];
  }

  const serializedData = serializeData(named);
  const finalData = {
    ...serializedData,
    network: isLocalhost ? "localhost" : network.name,
    chainId: Number(chain.chainId),
  };

  console.table(finalData);

  if (isLocalhost) {
    const target = path.join(process.cwd(), "public", "local-deployment.json");
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, `${JSON.stringify(finalData, null, 2)}\n`, "utf8");
    console.log(` local-deployment.json written -> public/local-deployment.json`);
  } else {
    console.log(
      " Live network detected: deployment.json is produced by the platform deploy tooling, not by this script."
    );
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });
