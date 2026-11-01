
import { network } from "hardhat";

async function main() {
  const { ethers } = await network.connect();

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  const contract = await ethers.getContractAt(
    "CertificateRegistry",
    contractAddress
  );

  const adminAddress = await contract.admin();

  console.log("Contract Admin:", adminAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
