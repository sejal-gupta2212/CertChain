
import { useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS } from "./contract";

function AdminDashboard() {
  const [institutionAddress, setInstitutionAddress] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const authorizeInstitution = async (e) => {
    e.preventDefault();
    setStatus("");
    setLoading(true);

    try {
      if (!window.ethereum) {
        throw new Error("MetaMask not detected");
      }

      if (!ethers.isAddress(institutionAddress)) {
        throw new Error("Please enter a valid Ethereum address");
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const network = await provider.getNetwork();

      if (network.chainId !== 11155111n) {
        throw new Error("Please connect to sepolia");
      }

      const signer = await provider.getSigner();
      const walletAddress = await signer.getAddress();

      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        [
          "function admin() view returns (address)",
          "function authorizeInstitution(address _institution)",
          "function authorizedInstitutions(address) view returns (bool)"
        ],
        signer
      );

      const adminAddress = await contract.admin();

      if (walletAddress.toLowerCase() !== adminAddress.toLowerCase()) {
        throw new Error("Only admin can authorize institutions");
      }

      const alreadyAuthorized =
        await contract.authorizedInstitutions(institutionAddress);

      if (alreadyAuthorized) {
        setStatus("This institution is already authorized");
        return;
      }

      setStatus("Please approve the transaction in MetaMask");

      const tx = await contract.authorizeInstitution(institutionAddress);

      await tx.wait();

      setStatus("Institution authorized successfully!");
      setInstitutionAddress("");
    } catch (error) {
      setStatus(error.reason || error.shortMessage || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="verification-card">
      <h2>Admin Dashboard</h2>

      <p>Authorize institutions to issue certificates.</p>

      <form onSubmit={authorizeInstitution}>
        <label>Institution Wallet Address</label>

        <input
          type="text"
          placeholder="Enter institution wallet address (0x...)"
          value={institutionAddress}
          onChange={(e) => setInstitutionAddress(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Processing..." : "Authorize Institution"}
        </button>
      </form>

      {status && (
        <p style={{ marginTop: "15px", overflowWrap: "anywhere" }}>
          {status}
        </p>
      )}
    </section>
  );
}

export default AdminDashboard;
