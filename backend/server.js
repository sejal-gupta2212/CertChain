
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { ethers } = require("ethers");
const crypto = require("crypto");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// File upload in memory
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }
});

// Blockchain connection
const provider = new ethers.JsonRpcProvider(
  process.env.RPC_URL
);

// Contract ABI: only functions needed for verification
const abi = [
  "function verifyCertificate(uint256,bytes32) view returns (bool)",
  "function certificates(uint256) view returns (bytes32,address,uint256,bool)"
];

const contract = new ethers.Contract(
  process.env.CONTRACT_ADDRESS,
  abi,
  provider
);

// Home route
app.get("/", (req, res) => {
  res.json({
    message: "Certificate Verification API is running"
  });
});

// Verify uploaded certificate
app.post(
  "/api/verify",
  upload.single("certificate"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          error: "Please upload a certificate"
        });
      }

      const id = req.body.certificateId;

      if (!id || !/^[1-9]\d*$/.test(id)) {
        return res.status(400).json({
          error: "Valid certificate ID required"
        });
      }

      // Generate SHA-256 hash
      const hash = "0x" +
        crypto.createHash("sha256")
          .update(req.file.buffer)
          .digest("hex");

      // Verify against blockchain
      const isValid = await contract.verifyCertificate(
        BigInt(id),
        hash
      );

      res.json({
        certificateId: id,
        hash,
        valid: isValid,
        message: isValid
          ? "Certificate is valid"
          : "Certificate is invalid or revoked"
      });

    } catch (error) {
      console.error(error);

      res.status(500).json({
        error: "Verification failed"
      });
    }
  }
);

app.listen(process.env.PORT || 5000, () => {
  console.log(
    `Backend running on port ${process.env.PORT || 5000}`
  );
});
