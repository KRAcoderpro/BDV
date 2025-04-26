import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import RegisterDiploma from "./components/RegisterDiploma";
import VerifyDiploma from "./components/VerifyDiploma";
import DiplomaInfo from "./components/DiplomaInfo";

function App() {
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);

  useEffect(() => {
    const init = async () => {
      if (!window.ethereum) {
        alert("MetaMask is not installed!");
        return;
      }

      try {
        // Создаем BrowserProvider из ethers v6
        const provider = new ethers.BrowserProvider(window.ethereum);

        // Получаем signer
        const signer = await provider.getSigner();

        // Получаем адрес из signer
        const address = await signer.getAddress();
        setAccount(address);

        // Адрес и ABI контракта
        const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
        const abi = [
          {
            "inputs": [
              {
                "internalType": "bytes32",
                "name": "hash",
                "type": "bytes32"
              },
              {
                "internalType": "string",
                "name": "university",
                "type": "string"
              }
            ],
            "name": "registerDiploma",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
          },
          {
            "inputs": [
              {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
              }
            ],
            "name": "diplomas",
            "outputs": [
              {
                "internalType": "string",
                "name": "university",
                "type": "string"
              },
              {
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
              }
            ],
            "stateMutability": "view",
            "type": "function"
          },
          {
            "inputs": [
              {
                "internalType": "bytes32",
                "name": "hash",
                "type": "bytes32"
              }
            ],
            "name": "getDiploma",
            "outputs": [
              {
                "internalType": "string",
                "name": "",
                "type": "string"
              },
              {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
              }
            ],
            "stateMutability": "view",
            "type": "function"
          },
          {
            "inputs": [
              {
                "internalType": "bytes32",
                "name": "hash",
                "type": "bytes32"
              }
            ],
            "name": "verifyDiploma",
            "outputs": [
              {
                "internalType": "bool",
                "name": "",
                "type": "bool"
              }
            ],
            "stateMutability": "view",
            "type": "function"
          }
        ];

        const contract = new ethers.Contract(contractAddress, abi, signer);
        setContract(contract);
      } catch (err) {
        console.error("MetaMask connection error:", err);
        alert("Failed to connect MetaMask");
      }
    };

    init();
  }, []);

  return (
    <div className="App">
      <h1>Blockchain Diploma Verification</h1>
      {account && <p>Connected account: {account}</p>}
      {contract && (
        <>
          <RegisterDiploma contract={contract} />
          <VerifyDiploma contract={contract} />
          <DiplomaInfo contract={contract} />
        </>
      )}
    </div>
  );
}

export default App;
