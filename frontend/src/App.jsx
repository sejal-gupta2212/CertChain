
import RevokeCertificate from "./RevokeCertificate";
import IssueCertificate from "./IssueCertificate";
import CertificateDetails from "./CertificateDetails";
import UserRole from "./UserRole";
import CertificateHistory from "./CertificateHistory";
import AdminDashboard from "./AdminDashboard";
import CertificateQR from "./CertificateQR";
import { CONTRACT_ADDRESS } from "./contract";
import { useState } from "react";
import axios from "axios";
import { ethers } from "ethers";
import { ShieldCheck, Upload, CheckCircle, XCircle } from "lucide-react";
import "./App.css";

function App() {
  
  const [certificateId, setCertificateId] = useState(() => {
    
  const params = new URLSearchParams(window.location.search);
  return params.get("certificateId") || "";
});
const [userRole, setUserRole] = useState("Verifier");
const [roleLoading, setRoleLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [account, setAccount] = useState("");
  const [walletError, setWalletError] = useState("");

  // Connect MetaMask
  const connectWallet = async () => {
    setWalletError("");

    if (!window.ethereum) {
      setWalletError("Please install MetaMask");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);

      await provider.send("eth_requestAccounts", []);

      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      alert("Dashboard wallet: " + address);

      setAccount(address);
    } catch (error) {
      setWalletError(error.message);
    }
  };

  // Switch MetaMask to Hardhat Local
  const switchToHardhat = async () => {
    if (!window.ethereum) {
      alert("MetaMask not detected");
      return;
    }

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x7A69" }],
      });

      alert("Hardhat Local selected!");
    } catch (error) {
      console.error(error);

      // Add Hardhat network if it is not available
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0x7A69",
                chainName: "Hardhat Local",
                rpcUrls: ["http://127.0.0.1:8545"],
                nativeCurrency: {
                  name: "Ether",
                  symbol: "ETH",
                  decimals: 18,
                },
              },
            ],
          });

          alert("Hardhat Local network added!");
        } catch (addError) {
          alert(addError.message);
        }
      } else {
        alert(error.message);
      }
    }
  };

  // Verify Certificate
  const verifyCertificate = async (e) => {
    e.preventDefault();

    if (!certificateId || !file) {
      alert("Please enter Certificate ID and upload a file");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const formData = new FormData();

      formData.append("certificateId", certificateId);
      formData.append("certificate", file);

      const response = await axios.post(
  "https://certchain-backend-03cn.onrender.com/api/verify",
  formData
);

      setResult(response.data);
    } catch (error) {
      setResult({
        valid: false,
        message:
          error.response?.data?.error ||
          "Verification failed. Check backend connection.",
      });
    } finally {
      setLoading(false);
    }
  };

const detectUserRole = async () => {
  setRoleLoading(true);

  try {
    if (!window.ethereum) {
      throw new Error("MetaMask not found");
    }

    const provider = new ethers.BrowserProvider(window.ethereum);

    const network = await provider.getNetwork();

    if (network.chainId !== 31337n) {
      throw new Error("Please switch to Hardhat Local");
    }

    const accounts = await provider.send("eth_requestAccounts", []);

    const address = accounts[0];

    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      [
        "function admin() view returns (address)",
        "function authorizedInstitutions(address) view returns (bool)"
      ],
      provider
    );

    const adminAddress = await contract.admin();
    const authorized =
      await contract.authorizedInstitutions(address);

    console.log("Wallet:", address);
    console.log("Admin:", adminAddress);
    console.log("Authorized:", authorized);

    if (address.toLowerCase() === adminAddress.toLowerCase()) {
      setUserRole("Admin");
    } else if (authorized) {
      setUserRole("Authorized Institution");
    } else {
      setUserRole("Verifier");
    }

  } catch (error) {
    console.error("Role detection error:", error);
    alert("Role check failed: " + (error.shortMessage || error.message));
    setUserRole("Verifier");
  } finally {
    setRoleLoading(false);
  }
};


  return (
    <div className="app">
      {/* Navbar */}
      <header className="navbar">
        <div className="brand">
          <ShieldCheck size={30} />
          <span>CertChain</span>
        </div>

        <button onClick={connectWallet}>
          {account
            ? `${account.slice(0, 6)}...${account.slice(-4)}`
            : "Connect MetaMask"}
        </button>
      </header>

      <main className="main-content">
        <h1>Blockchain Certificate Verification</h1>

        <p>
          Verify academic certificates securely using blockchain
          technology.
        </p>

        {/* MetaMask Network */}
        <section className="verification-card">
          <h2>MetaMask Connection</h2>

          <button onClick={switchToHardhat}>
            Switch to Hardhat Local
          </button>

          {account && <p>Connected Wallet: {account}</p>}

          {walletError && (
            <p style={{ color: "red" }}>{walletError}</p>
          )}
        </section>
        
<div className="role-dashboard">
  <h2>CertChain Dashboard</h2>

  <button onClick={detectUserRole} disabled={roleLoading}>
    {roleLoading ? "Checking Role..." : "Load My Dashboard"}
  </button>

  <p>
    <strong>Current Role:</strong> {userRole}
  </p>

  {userRole === "Admin" && (
    <>
      <AdminDashboard />
      <IssueCertificate />
      <RevokeCertificate />
    </>
  )}

  {userRole === "Authorized Institution" && (
    <>
      <IssueCertificate />
      <RevokeCertificate />
    </>
  )}

  <CertificateDetails />
  <CertificateHistory />
  <CertificateQR />
</div>


        {/* Certificate Verification */}
        <section className="verification-card">
          <h2>Verify Certificate</h2>

          <form onSubmit={verifyCertificate}>
            <label>Certificate ID</label>

            <input
              type="number"
              min="1"
              placeholder="Enter Certificate ID"
              value={certificateId}
              onChange={(e) => setCertificateId(e.target.value)}
              required
            />

            <label>Upload Certificate</label>

            <div className="upload-box">
              <Upload size={28} />

              <input
                type="file"
                accept=".pdf,.txt"
                onChange={(e) => {
                  setFile(e.target.files?.[0] || null);
                  setResult(null);
                }}
                required
              />
            </div>

            <button type="submit" disabled={loading}>
              {loading ? "Verifying..." : "Verify Certificate"}
            </button>
          </form>

          {/* Verification Result */}
          {result && (
            <div
              className="result-box"
              style={{
                marginTop: "20px",
                color: result.valid ? "green" : "red",
              }}
            >
              {result.valid ? (
                <CheckCircle size={28} />
              ) : (
                <XCircle size={28} />
              )}

              <h3>
                {result.valid
                  ? "Certificate Verified!"
                  : "Verification Failed"}
              </h3>

              <p>{result.message}</p>

              {result.hash && (
                <p style={{ overflowWrap: "anywhere" }}>
                  <strong>SHA-256 Hash:</strong> {result.hash}
                </p>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
