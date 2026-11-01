
import { network } from "hardhat";

async function main() {
  const { ethers } = await network.connect();

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  const certificate = await ethers.getContractAt(
    "CertificateRegistry",
    contractAddress
  );

  // Latest certificate ID
  const id = await certificate.certificateCount();

  if (id === 0n) {
    throw new Error("No certificate has been issued yet");
  }

  // Check before revocation
  const before = await certificate.verifyCertificate(id);
  console.log("Before Revocation:", before);

  // Revoke certificate
  const tx = await certificate.revokeCertificate(id);
  await tx.wait();

  console.log("Certificate revoked successfully!");

  // Check after revocation
  const after = await certificate.verifyCertificate(id);
  console.log("After Revocation:", after);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
