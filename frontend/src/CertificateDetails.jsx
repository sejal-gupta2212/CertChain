
import { useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS } from "./contract";

function CertificateDetails() {
  const [id, setId] = useState("");
  const [details, setDetails] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchDetails = async (e) => {
    e.preventDefault();
    setDetails(null);
    setError("");
    setLoading(true);

    try {
      if (!window.ethereum) {
        throw new Error("Please install or unlock MetaMask");
      }

      if (!id.trim() || !/^[1-9]\d*$/.test(id.trim())) {
        throw new Error("Enter a valid Certificate ID");
      }

      const provider = new ethers.BrowserProvider(window.ethereum);

      const network = await provider.getNetwork();

      if (network.chainId !== 11155111n) {
        throw new Error("Please switch MetaMask to Sepolia");
      }

      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        [
          "function certificates(uint256) view returns (bytes32,address,uint256,bool)",
          "function certificateCount() view returns (uint256)"
        ],
        provider
      );

      const count = await contract.certificateCount();
      const certificateId = BigInt(id);

      if (certificateId < 1n || certificateId > count) {
        throw new Error("Certificate ID not found");
      }

      const cert = await contract.certificates(certificateId);

      setDetails({
        hash: cert[0],
        issuer: cert[1],
        date: new Date(Number(cert[2]) * 1000).toLocaleString(),
        valid: cert[3]
      });

    } catch (err) {
      console.error("Fetch Details Error:", err);
      setError(err.shortMessage || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="verification-card">
      <h2>Certificate Details</h2>

      <form onSubmit={fetchDetails}>
        <label>Certificate ID</label>

        <input
          type="number"
          min="1"
          value={id}
          onChange={(e) => setId(e.target.value)}
          placeholder="Enter Certificate ID"
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Loading..." : "View Details"}
        </button>
      </form>

      {details && (
        <div style={{ marginTop: "20px", overflowWrap: "anywhere" }}>
          <p><strong>Certificate Hash:</strong> {details.hash}</p>
          <p><strong>Issuer:</strong> {details.issuer}</p>
          <p><strong>Issue Date:</strong> {details.date}</p>
          <p>
            <strong>Status:</strong>{" "}
            {details.valid ? "Active" : "Revoked"}
          </p>
        </div>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}
    </section>
  );
}

export default CertificateDetails;
