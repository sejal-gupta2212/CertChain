export const CONTRACT_ADDRESS =
  "0x7828Dcc28E96B81674aF9E28232d05d7b9734322";

export const CONTRACT_ABI = [
  // Certificate issuance
  "function issueCertificate(bytes32 _hash)",

  // Certificate verification
  "function verifyCertificate(uint256 _id, bytes32 _hash) view returns (bool)",

  // Certificate count
  "function certificateCount() view returns (uint256)",

  // Institution authorization
  "function authorizedInstitutions(address) view returns (bool)",
  "function authorizeInstitution(address _institution)",

  // Certificate revocation
  "function revokeCertificate(uint256 _id)",

  // Certificate details
  "function certificates(uint256) view returns (bytes32 hash, address issuer, bool isValid, uint256 issuedAt)",

  // Admin
  "function admin() view returns (address)",

  // Certificate history
  "event CertificateIssued(uint256 indexed certificateId, bytes32 certificateHash, address indexed issuer)"
];