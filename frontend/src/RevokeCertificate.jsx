
import { useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS } from "./contract";

function RevokeCertificate() {
  const [certificateId, setCertificateId] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const revokeCertificate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");

    try {
      if (!window.ethereum) {
        throw new Error("MetaMask not detected");
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const network = await provider.getNetwork();

      if (network.chainId !== 31337n) {
        throw new Error("Please switch to Hardhat Local");
      }

      const signer = await provider.getSigner();

      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        ["function revokeCertificate(uint256 _id)"],
        signer
      );

      const tx = await contract.revokeCertificate(
        BigInt(certificateId)
      );

      setStatus("Waiting for transaction confirmation...");
      await tx.wait();

      setStatus("Certificate revoked successfully!");
    } catch (error) {
      setStatus(
        error.reason || error.shortMessage || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="verification-card">
      <h2>Revoke Certificate</h2>

      <form onSubmit={revokeCertificate}>
        <label>Certificate ID</label>

        <input
          type="number"
          min="1"
          value={certificateId}
          onChange={(e) => setCertificateId(e.target.value)}
          placeholder="Enter Certificate ID"
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Processing..." : "Revoke Certificate"}
        </button>
      </form>

      {status && <p>{status}</p>}
    </section>
  );
}

export default RevokeCertificate;
