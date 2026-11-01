
import { network } from "hardhat";

async function main() {
  const { ethers } = await network.connect();

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const verifierAddress = "0x36410869D30bB57B5E05F1f2eDFD240Ecb758a77";

  const contract = await ethers.getContractAt(
    "CertificateRegistry",
    contractAddress
  );

  const isAuthorized =
    await contract.authorizedInstitutions(verifierAddress);

  console.log("Verifier wallet:", verifierAddress);
  console.log("Authorized:", isAuthorized);

  if (isAuthorized) {
    console.log("TEST FAILED: Verifier is authorized.");
  } else {
    console.log("TEST PASSED: Verifier is not authorized.");
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
