
# CertChain
## Blockchain-Based Certificate Verification System

CertChain is a decentralized application (DApp) designed
to issue, verify, and revoke digital certificates using
Ethereum smart contracts.

## Technologies Used

- Blockchain: Ethereum (Hardhat Local Network)
- Smart Contract: Solidity
- Smart Contract Development: Hardhat 3
- Frontend: React.js, Vite, Ethers.js
- Backend: Node.js, Express.js
- Wallet Integration: MetaMask
- Certificate Integrity: SHA-256
- QR Code: qrcode.react

## Main Features

1. Certificate issuance by authorized institutions
2. Certificate verification using SHA-256 hash
3. QR-code-based verification links
4. Certificate revocation
5. Role-based dashboard
6. Admin institution authorization
7. Certificate history
8. Blockchain transaction details
9. Duplicate certificate prevention
10. Unauthorized issuance protection

## User Roles

### Admin
- Authorizes institutions
- Manages permissions through the smart contract

### Authorized Institution
- Issues certificates
- Revokes certificates it issued

### Verifier
- Verifies certificates
- Views public certificate details

## Project Structure

certificate-verification/
  blockchain/
    contracts/
    scripts/
    test/
  backend/
    server.js
    .env
  frontend/
    src/
  README.md

## How to Run

### 1. Start Blockchain

cd blockchain
npx hardhat node

### 2. Deploy Smart Contract

In another terminal:

cd blockchain
npx hardhat run scripts/deploy.ts --network localhost

Update the deployed contract address in:
- frontend/src/contract.js
- backend/.env

### 3. Authorize Institution

Update blockchain/scripts/authorize.ts with the
latest contract address and institution wallet address.

npx hardhat run scripts/authorize.ts --network localhost

### 4. Start Backend

cd backend
node server.js

### 5. Start Frontend

cd frontend
npm run dev

Open http://localhost:5173/

Connect MetaMask to Hardhat Local Network
(Chain ID: 31337).

## Certificate Verification Process

1. Institution uploads a certificate.
2. SHA-256 hash of the file is generated.
3. Smart contract stores the hash and issuer information.
4. Certificate ID is generated.
5. Verifier enters the certificate ID and uploads the file.
6. The uploaded file's hash is compared with the stored hash.
7. The certificate is reported as Valid or Invalid.

## Security Features

- Only authorized institutions can issue certificates.
- Duplicate certificate hashes are rejected.
- Unauthorized certificate issuance is blocked.
- Revoked certificates fail verification.
- Certificate integrity is checked using SHA-256.

## Testing

The following tests were completed:

- Certificate issuance
- Valid certificate verification
- QR-code verification
- Certificate revocation
- Invalid certificate verification
- Certificate history
- Duplicate certificate prevention
- Role-based access checks
- Unauthorized issuance rejection
- UI and error handling

## Limitations

- Currently runs on a local Hardhat blockchain.
- Local blockchain data resets when the node restarts.
- QR verification requires access to the running frontend.
- The original certificate file is required for hash verification.

## Future Enhancements

- Deployment to an Ethereum testnet
- Institution management dashboard improvements
- Database integration
- Permanent file storage
- Public certificate verification portal
