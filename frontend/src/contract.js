
export const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export const CONTRACT_ABI = [
  "function issueCertificate(bytes32 _hash)",
  "function verifyCertificate(uint256 _id, bytes32 _hash) view returns (bool)",
  "function certificateCount() view returns (uint256)",
  "function authorizedInstitutions(address) view returns (bool)",
];
