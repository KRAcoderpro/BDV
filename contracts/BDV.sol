 // SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract DiplomaVerification {
    struct Diploma {
        string university;
        uint256 timestamp;
    }

    mapping(bytes32 => Diploma) public diplomas;

    function registerDiploma(bytes32 hash, string memory university) public {
        require(diplomas[hash].timestamp == 0, "Diploma already exists");
        diplomas[hash] = Diploma(university, block.timestamp);
    }

    function verifyDiploma(bytes32 hash) public view returns (bool) {
        return diplomas[hash].timestamp != 0;
    }

    function getDiploma(bytes32 hash) public view returns (string memory, uint256) {
        require(diplomas[hash].timestamp != 0, "Diploma not found");
        Diploma memory d = diplomas[hash];
        return (d.university, d.timestamp);
    }
}