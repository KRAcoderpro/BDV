// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract DiplomaRegistry {
    struct Diploma {
        string university;
        uint256 timestamp;
        string studentId;
        string diplomaType;
        string ipfsHash;
        bool isValid;
    }

    mapping(bytes32 => Diploma) public diplomas;
    mapping(address => bool) public authorizedUniversities;
    mapping(address => string) public universityNames;

    address public admin;

    event DiplomaRegistered(
        bytes32 indexed hash,
        string university,
        string studentId,
        uint256 timestamp
    );
    event DiplomaRevoked(bytes32 indexed hash);
    event UniversityAuthorized(address indexed university, string name);
    event UniversityRevoked(address indexed university);
    event UniversityNameUpdated(address indexed university, string name);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call this function");
        _;
    }

    modifier onlyAuthorized() {
        require(authorizedUniversities[msg.sender], "Not an authorized university");
        _;
    }

    constructor() {
        admin = msg.sender;
        authorizedUniversities[msg.sender] = true;
        universityNames[msg.sender] = "Admin University";
        emit UniversityAuthorized(msg.sender, "Admin University");
    }

    function authorizeUniversity(address university, string calldata name) external onlyAdmin {
        require(!authorizedUniversities[university], "Already authorized");
        authorizedUniversities[university] = true;
        universityNames[university] = name;
        emit UniversityAuthorized(university, name);
    }

    function updateUniversityName(address university, string calldata name) external onlyAdmin {
        require(authorizedUniversities[university], "University not authorized");
        universityNames[university] = name;
        emit UniversityNameUpdated(university, name);
    }

    function revokeUniversity(address university) external onlyAdmin {
        require(authorizedUniversities[university], "University not authorized");
        authorizedUniversities[university] = false;
        delete universityNames[university];
        emit UniversityRevoked(university);
    }

    function registerDiploma(
        bytes32 hash,
        string calldata studentId,
        string calldata diplomaType,
        string calldata ipfsHash
    ) external onlyAuthorized {
        require(diplomas[hash].timestamp == 0, "Diploma already exists");

        string memory university = universityNames[msg.sender];

        diplomas[hash] = Diploma(
            university,
            block.timestamp,
            studentId,
            diplomaType,
            ipfsHash,
            true
        );

        emit DiplomaRegistered(hash, university, studentId, block.timestamp);
    }

    function revokeDiploma(bytes32 hash) external onlyAuthorized {
        require(diplomas[hash].timestamp != 0, "Diploma not found");
        require(diplomas[hash].isValid, "Diploma already revoked");
        diplomas[hash].isValid = false;
        emit DiplomaRevoked(hash);
    }

    function verifyDiploma(bytes32 hash) external view returns (bool) {
        return diplomas[hash].timestamp != 0 && diplomas[hash].isValid;
    }

    function getDiploma(bytes32 hash)
        external
        view
        returns (
            string memory university,
            uint256 timestamp,
            string memory studentId,
            string memory diplomaType,
            string memory ipfsHash,
            bool isValid
        )
    {
        require(diplomas[hash].timestamp != 0, "Diploma not found");
        Diploma memory d = diplomas[hash];
        return (d.university, d.timestamp, d.studentId, d.diplomaType, d.ipfsHash, d.isValid);
    }

    function getUniversityName(address university) external view returns (string memory) {
        require(authorizedUniversities[university], "University not authorized");
        return universityNames[university];
    }
}
