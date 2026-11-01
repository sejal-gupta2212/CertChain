
import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.connect();

describe("CertificateRegistry", function () {

  async function deployContract() {
    const [admin, other] = await ethers.getSigners();

    const certificate = await ethers.deployContract(
      "CertificateRegistry"
    );

    await certificate.waitForDeployment();

    return { certificate, admin, other };
  }

  it("Should issue a certificate", async function () {
    const { certificate } = await deployContract();

    await certificate.issueCertificate(
      "Rahul",
      "BSc Computer Science",
      "Delhi University"
    );

    expect(await certificate.certificateCount()).to.equal(1n);
  });

  it("Should verify a certificate", async function () {
    const { certificate } = await deployContract();

    await certificate.issueCertificate(
      "Rahul",
      "BSc Computer Science",
      "Delhi University"
    );

    expect(await certificate.verifyCertificate(1)).to.equal(true);
  });

  it("Should revoke a certificate", async function () {
    const { certificate } = await deployContract();

    await certificate.issueCertificate(
      "Rahul",
      "BSc Computer Science",
      "Delhi University"
    );

    await certificate.revokeCertificate(1);

    expect(await certificate.verifyCertificate(1)).to.equal(false);
  });

  it("Should prevent unauthorized issuance", async function () {
    const { certificate, other } = await deployContract();

    await expect(
      certificate.connect(other).issueCertificate(
        "Rahul",
        "BSc Computer Science",
        "Delhi University"
      )
    ).to.be.revertedWith("Only admin can issue");
  });

});
