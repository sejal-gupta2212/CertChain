
import { network } from "hardhat";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

async function main() {
  const { ethers } = await network.connect();

  const contractAddress = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";

  const certificate = await ethers.getContractAt(
    "CertificateRegistry",
    contractAddress
  );

  const file = readFileSync(
    "certificates/sample-certificate.txt"
  );

  const hash = "0x" +
    createHash("sha256").update(file).digest("hex");

  // ID of the certificate issued in Step 8.3
  const certificateId = 1;

  const isValid = await certificate.verifyCertificate(
    certificateId,
    hash
  );

  console.log("Verification Result:", isValid);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
