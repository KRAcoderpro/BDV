import React, { useState } from "react";
import { ipfsClient } from "../ipfs";
import { sha256, toUtf8Bytes } from "ethers";

const RegisterDiploma = ({ contract }) => {
  const [universityName, setUniversityName] = useState("");
  const [ipfsPath, setIpfsPath] = useState(null);
  const [hash, setHash] = useState(null);

  const register = async () => {
    const file = document.getElementById("diplomaFile").files[0];
    const result = await ipfsClient.add(file);
    const ipfsHash = result.path;

    const hashValue = sha256(toUtf8Bytes(ipfsHash));
    await contract.registerDiploma(hashValue, universityName);

    setIpfsPath(ipfsHash);
    setHash(hashValue);
    console.log(hashValue);
    alert("Diploma registered!");
  };

  return (
    <div>
      <h2>Register Diploma</h2>
      <input
        type="text"
        placeholder="University Name"
        onChange={(e) => setUniversityName(e.target.value)}
      />
      <input type="file" id="diplomaFile" />
      <button onClick={register}>Register</button>

      {hash && (
        <div style={{ marginTop: "1em" }}>
          <p><strong>IPFS Hash:</strong> {ipfsPath}</p>
          <p><strong>SHA-256 Hash:</strong> {hash}</p>
          <a
            href={`https://ipfs.io/ipfs/${ipfsPath}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            📥 Download File from IPFS
          </a>
        </div>
      )}
    </div>
  );
};

export default RegisterDiploma;
