
import { network } from "hardhat";

async function main() {
  const { ethers } = await network.connect();

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const walletAddress = "0xbF1D5845E97881736F24e8C5D319683d834231cA"
  const contract = await ethers.getContractAt(
    "CertificateRegistry",
    contractAddress
  );

  const isAuthorized =
    await contract.authorizedInstitutions(walletAddress);

  console.log("Wallet:", walletAddress);
  console.log("Authorized:", isAuthorized);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
