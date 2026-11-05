
import { useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS } from "./contract";

function CertificateHistory() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [warning, setWarning] = useState("");

  const loadCertificates = async () => {
    setLoading(true);
    setError("");
    setWarning("");
    setCertificates([]);

    try {
      if (!window.ethereum) {
        throw new Error("Please install or unlock MetaMask");
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const network = await provider.getNetwork();

      if (network.chainId !== 11155111n) {
        throw new Error("Please switch MetaMask to Sepolia");
      }

      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        [
          "function certificateCount() view returns (uint256)",
          "function certificates(uint256) view returns (bytes32,address,uint256,bool)",
          "event CertificateIssued(uint256 indexed certificateId, bytes32 certificateHash, address indexed issuer)"
        ],
        provider
      );

      // Step 1: Get total certificate count
      const count = Number(await contract.certificateCount());

      if (!Number.isSafeInteger(count) || count < 0) {
        throw new Error("Invalid certificate count");
      }

      if (count === 0) {
        setCertificates([]);
        return;
      }

      // Step 2: Fetch certificate records from blockchain
      const records = [];

      for (let id = 1; id <= count; id++) {
        const cert = await contract.certificates(id);

        records.push({
          id,
          hash: cert[0],
          issuer: cert[1],
          date: new Date(
            Number(cert[2]) * 1000
          ).toLocaleString(),
          status: cert[3] ? "Active" : "Revoked",
          txHash: "Not available",
          blockNumber: "Not available"
        });
      }

      // Step 3: Try fetching transaction events separately
      try {
        const latestBlock = await provider.getBlockNumber();

        const issueEvents = await contract.queryFilter(
          contract.filters.CertificateIssued(),
          Math.max(0, latestBlock - 10000),
          latestBlock
        );

        const transactionDetails = new Map();

        for (const event of issueEvents) {
          const certificateId = Number(event.args[0]);

          transactionDetails.set(certificateId, {
            txHash: event.transactionHash,
            blockNumber: event.blockNumber
          });
        }

        // Add transaction details wherever available
        for (const record of records) {
          const txDetails = transactionDetails.get(record.id);

          if (txDetails) {
            record.txHash = txDetails.txHash;
            record.blockNumber = txDetails.blockNumber;
          }
        }
      } catch (eventError) {
        console.warn("Event fetching failed:", eventError);
        setWarning(
          "Certificate details loaded, but transaction history could not be fetched."
        );
      }

      setCertificates(records.reverse());

    } catch (err) {
      console.error("Certificate History Error:", err);
      setError(
        err.shortMessage || err.reason || err.message
      );
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

      {error && (
        <p style={{ color: "red" }}>{error}</p>
      )}

      {warning && (
        <p style={{ color: "orange" }}>{warning}</p>
      )}

      {certificates.map((cert) => (
        <div key={cert.id} className="certificate-record">
          <h3>Certificate #{cert.id}</h3>

          <p style={{ overflowWrap: "anywhere" }}>
            <strong>Issue Transaction:</strong> {cert.txHash}
          </p>

          <p>
            <strong>Block Number:</strong> {cert.blockNumber}
          </p>

          <p>
            <strong>Issuer:</strong> {cert.issuer}
          </p>

          <p>
            <strong>Issue Date:</strong> {cert.date}
          </p>

          <p>
            <strong>Status:</strong> {cert.status}
          </p>

          <p style={{ overflowWrap: "anywhere" }}>
            <strong>SHA-256 Hash:</strong> {cert.hash}
          </p>

          <hr />
        </div>
      ))}

      {!loading && certificates.length === 0 && !error && (
        <p>No certificates found.</p>
      )}
    </section>
  );
}

export default CertificateHistory;
