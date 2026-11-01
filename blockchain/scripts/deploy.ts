
import { network } from "hardhat";

async function main() {
  const { ethers } = await network.connect();

  console.log("Deploying CertificateRegistry...");

  const certificate = await ethers.deployContract(
    "CertificateRegistry"
  );

  await certificate.waitForDeployment();

  const address = await certificate.getAddress();

  console.log("Contract deployed at:", address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
