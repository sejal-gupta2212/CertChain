
import { network } from "hardhat";

async function main() {
  const { ethers } = await network.connect();

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const institutionAddress = "0xbF1D5845E97881736F24e8C5D319683d834231cA";

  const contract = await ethers.getContractAt(
    "CertificateRegistry",
    contractAddress
  );

  const tx = await contract.authorizeInstitution(
    institutionAddress
  );

  await tx.wait();

  console.log("Institution authorized successfully!");
  console.log("Authorized wallet:", institutionAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
