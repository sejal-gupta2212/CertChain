
import { network } from "hardhat";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

async function main() {
  const { ethers } = await network.connect();

  // Replace with your latest deployed contract address
  const contractAddress = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";

  const certificate = await ethers.getContractAt(
    "CertificateRegistry",
    contractAddress
  );

  // Step 1: Read certificate file
  const file = readFileSync(
    "certificates/sample-certificate.txt"
  );

  // Step 2: Generate SHA-256 hash
  const hash = "0x" +
    createHash("sha256").update(file).digest("hex");

  console.log("Certificate Hash:", hash);

  // Step 3: Issue certificate
  const tx = await certificate.issueCertificate(hash);
  await tx.wait();

  console.log("Certificate issued successfully!");

  // Step 4: Get certificate ID
  const id = await certificate.certificateCount();

  console.log("Certificate ID:", id.toString());

  // Step 5: Verify certificate
  const isValid = await certificate.verifyCertificate(
    id,
    hash
  );

  console.log("Certificate Valid:", isValid);

  // Step 6: Display blockchain details
  const details = await certificate.certificates(id);

  console.log("Issuer:", details.issuer);
  console.log("Issue Timestamp:", details.issueDate.toString());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
