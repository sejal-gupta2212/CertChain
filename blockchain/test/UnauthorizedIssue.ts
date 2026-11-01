
import { network } from "hardhat";
import { expect } from "chai";

describe("CertificateRegistry Security", function () {
  it("should reject unauthorized certificate issuance", async function () {
    const { ethers } = await network.connect();

    const [admin, unauthorized] = await ethers.getSigners();

    const contract = await ethers.deployContract(
      "CertificateRegistry",
      [],
      admin
    );

    await contract.waitForDeployment();

    const hash = ethers.keccak256(
      ethers.toUtf8Bytes("test-certificate")
    );

    await expect(
  contract.connect(unauthorized).issueCertificate(hash)
).to.be.revert(ethers);

    console.log("TEST PASSED: Unauthorized issuance rejected");
  });
});
