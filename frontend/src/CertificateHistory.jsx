
import { useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS } from "./contract";

function CertificateHistory() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadCertificates = async () => {
    setLoading(true);
    setError("");

    try {
      const provider = new ethers.JsonRpcProvider(
        "http://127.0.0.1:8545"
      );

      
const contract = new ethers.Contract(
  CONTRACT_ADDRESS,
  [
    "function certificateCount() view returns (uint256)",
    "function certificates(uint256) view returns (bytes32,address,uint256,bool)",
    "event CertificateIssued(uint256 indexed certificateId, bytes32 certificateHash, address indexed issuer)"
  ],
  provider
);


      const count = Number(await contract.certificateCount());
      const records = [];
      
const issueEvents = await contract.queryFilter(
  contract.filters.CertificateIssued(),
  0,
  "latest"
);

const transactionDetails = new Map();

for (const event of issueEvents) {
  const certificateId = Number(event.args[0]);

  transactionDetails.set(certificateId, {
    txHash: event.transactionHash,
    blockNumber: event.blockNumber
  });
}


      for (let id = 1; id <= count; id++) {
        const cert = await contract.certificates(id);

        
const txDetails = transactionDetails.get(id);

records.push({
  id,
  hash: cert[0],
  issuer: cert[1],
  date: new Date(Number(cert[2]) * 1000).toLocaleString(),
  status: cert[3] ? "Active" : "Revoked",
  txHash: txDetails?.txHash || "Not available",
  blockNumber: txDetails?.blockNumber ?? "Not available"
});

      }

      setCertificates(records.reverse());
    } catch (err) {
      setError(err.shortMessage || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="verification-card">
      <h2>Certificate History</h2>

      <button onClick={loadCertificates} disabled={loading}>
        {loading ? "Loading..." : "Load Certificate History"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {certificates.map((cert) => (
        <div key={cert.id} className="certificate-record">
          <h3>Certificate #{cert.id}</h3>
          <p style={{ overflowWrap: "anywhere" }}>
  <strong>Issue Transaction:</strong> {cert.txHash}
</p>

<p>
  <strong>Block Number:</strong> {cert.blockNumber}
</p>
          <p><strong>Issuer:</strong> {cert.issuer}</p>
          <p><strong>Issue Date:</strong> {cert.date}</p>
          <p><strong>Status:</strong> {cert.status}</p>
          <p style={{ overflowWrap: "anywhere" }}>
            <strong>SHA-256 Hash:</strong> {cert.hash}
          </p>
          <hr />
        </div>
      ))}

      {!loading && certificates.length === 0 && !error && (
        <p>No certificates loaded.</p>
      )}
    </section>
  );
}

export default CertificateHistory;
