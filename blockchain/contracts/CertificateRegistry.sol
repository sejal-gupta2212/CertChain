
 // SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract CertificateRegistry {

    address public admin;

    struct Certificate {
        bytes32 certificateHash;
        address issuer;
        uint256 issueDate;
        bool isValid;
    }

    mapping(uint256 => Certificate) public certificates;
    mapping(address => bool) public authorizedInstitutions;
    mapping(bytes32 => bool) public registeredHashes;

    uint256 public certificateCount;

    event CertificateIssued(
        uint256 indexed id,
        bytes32 certificateHash,
        address indexed issuer
    );

    event CertificateRevoked(uint256 indexed id);

    constructor() {
        admin = msg.sender;
        authorizedInstitutions[msg.sender] = true;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin allowed");
        _;
    }

    modifier onlyInstitution() {
        require(
            authorizedInstitutions[msg.sender],
            "Not authorized institution"
        );
        _;
    }

    function authorizeInstitution(
        address _institution
    ) public onlyAdmin {
        require(_institution != address(0), "Invalid address");
        authorizedInstitutions[_institution] = true;
    }

    function issueCertificate(
        bytes32 _hash
    ) public onlyInstitution {

        require(_hash != bytes32(0), "Invalid hash");
        require(!registeredHashes[_hash], "Already registered");

        certificateCount++;

        certificates[certificateCount] = Certificate(
            _hash,
            msg.sender,
            block.timestamp,
            true
        );

        registeredHashes[_hash] = true;

        emit CertificateIssued(
            certificateCount,
            _hash,
            msg.sender
        );
    }

    function verifyCertificate(
        uint256 _id,
        bytes32 _hash
    ) public view returns (bool) {

        Certificate memory cert = certificates[_id];

        return (
            cert.isValid &&
            cert.certificateHash == _hash &&
            authorizedInstitutions[cert.issuer]
        );
    }

    function revokeCertificate(
        uint256 _id
    ) public {

        Certificate storage cert = certificates[_id];

        require(cert.isValid, "Invalid certificate");

        require(
            msg.sender == cert.issuer || msg.sender == admin,
            "Not authorized"
        );

        cert.isValid = false;

        emit CertificateRevoked(_id);
    }
}
