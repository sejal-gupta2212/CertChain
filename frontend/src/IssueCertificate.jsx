
import { useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "./contract";

function IssueCertificate() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const issueCertificate = async (e) => {
    e.preventDefault();

    if (!file) {
      setStatus("Please select a certificate file");
      return;
    }

    if (!window.ethereum) {
      setStatus("MetaMask not detected");
      return;
    }

    setLoading(true);
    setStatus("Preparing certificate...");

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const network = await provider.getNetwork();

      if (network.chainId !== 31337n) {
        throw new Error("Switch MetaMask to Hardhat Local");
      }

      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        signer
      );

      const authorized = await contract.authorizedInstitutions(address);

      if (!authorized) {
        throw new Error("This wallet is not an authorized institution");
      }

      const bytes = await file.arrayBuffer();
      const digest = await crypto.subtle.digest("SHA-256", bytes);

      const hash =
        "0x" +
        Array.from(new Uint8Array(digest))
          .map((byte) => byte.toString(16).padStart(2, "0"))
          .join("");

      setStatus("Please approve the transaction in MetaMask");

      const tx = await contract.issueCertificate(hash);
      await tx.wait();

      const id = await contract.certificateCount();

      setStatus(`Certificate issued successfully! ID: ${id.toString()}`);
    } catch (error) {
      console.error(error);
      setStatus(error.reason || error.shortMessage || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="verification-card">
      <h2>Issue Certificate</h2>

      <form onSubmit={issueCertificate}>
        <label>Upload Certificate</label>

        <input
          type="file"
          accept=".pdf,.txt"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Processing..." : "Issue Certificate"}
        </button>
      </form>

      {status && <p>{status}</p>}
    </section>
  );
}

export default IssueCertificate;
