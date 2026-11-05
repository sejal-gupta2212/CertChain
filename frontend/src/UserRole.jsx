
import { useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS } from "./contract";

function UserRole() {
  const [role, setRole] = useState("");
  const [wallet, setWallet] = useState("");
  const [loading, setLoading] = useState(false);

  const checkRole = async () => {
    setLoading(true);
    setRole("");

    try {
      if (!window.ethereum) {
        throw new Error("MetaMask not detected");
      }

      const provider = new ethers.BrowserProvider(window.ethereum);

      const network = await provider.getNetwork();

      if (network.chainId !== 11155111n) {
        throw new Error("Please connect to sepolia");
      }

      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        [
          "function admin() view returns (address)",
          "function authorizedInstitutions(address) view returns (bool)"
        ],
        provider
      );

      const adminAddress = await contract.admin();
      const isInstitution =
        await contract.authorizedInstitutions(address);

      setWallet(address);

      if (address.toLowerCase() === adminAddress.toLowerCase()) {
        setRole("Admin");
      } else if (isInstitution) {
        setRole("Authorized Institution");
      } else {
        setRole("Verifier");
      }
    } catch (error) {
      setRole(error.shortMessage || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="verification-card">
      <h2>User Role Dashboard</h2>

      <button onClick={checkRole} disabled={loading}>
        {loading ? "Checking..." : "Check My Role"}
      </button>

      {wallet && (
        <p style={{ overflowWrap: "anywhere" }}>
          <strong>Wallet:</strong> {wallet}
        </p>
      )}

      {role && (
        <p>
          <strong>Role:</strong> {role}
        </p>
      )}
    </section>
  );
}

export default UserRole;
