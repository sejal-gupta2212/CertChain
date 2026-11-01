
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
      const provider = new ethers.JsonRpcProvider(
        "http://127.0.0.1:8545"
      );

      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        [
          "function certificates(uint256) view returns (bytes32,address,uint256,bool)",
          "function certificateCount() view returns (uint256)"
        ],
        provider
      );

      const count = await contract.certificateCount();

      if (BigInt(id) < 1n || BigInt(id) > count) {
        throw new Error("Certificate ID not found");
      }

      const cert = await contract.certificates(BigInt(id));

      setDetails({
        hash: cert[0],
        issuer: cert[1],
        date: new Date(Number(cert[2]) * 1000).toLocaleString(),
        valid: cert[3]
      });
    } catch (err) {
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
