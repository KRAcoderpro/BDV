import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import ManageUniversities from './ManageUniversities';
import RegisterDiploma from './RegisterDiploma';
import VerifyDiploma from './VerifyDiploma';
import DiplomaInfo from './DiplomaInfo';
import { contractAddress, contractABI } from '../utils/contract';
import logo from '../assets/BDV_logo.png';

const App = () => {
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [university, setUniversity] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const checkAccess = async (contractInstance, address) => {
    try {
      const admin = await contractInstance.admin();
      const authorized = await contractInstance.authorizedUniversities(address);
      setIsAdmin(address.toLowerCase() === admin.toLowerCase());
      setIsAuthorized(authorized);

      if (authorized) {
        const uniName = await contractInstance.getUniversityName(address);
        setUniversity(uniName);
      } else {
        setUniversity('');
      }
    } catch (err) {
      console.error('Ошибка проверки прав доступа:', err);
      setError('Ошибка проверки прав доступа: ' + (err.reason || err.message));
    }
  };

  useEffect(() => {
    if (!window.ethereum) {
      setError('MetaMask не установлен!');
      return;
    }

    const provider = new ethers.BrowserProvider(window.ethereum);

    const load = async () => {
      try {
        setLoading(true);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);

        const contractInstance = new ethers.Contract(contractAddress, contractABI, signer);
        setContract(contractInstance);
        setError(null);

        await checkAccess(contractInstance, address);
      } catch (err) {
        console.error('Ошибка при инициализации:', err);
        setError('Ошибка подключения к MetaMask: ' + (err.reason || err.message));
      } finally {
        setLoading(false);
      }
    };

    const handleAccountsChanged = async (accounts) => {
      if (accounts.length === 0) {
        setAccount(null);
        setContract(null);
        setIsAdmin(false);
        setIsAuthorized(false);
        setUniversity('');
        setError('MetaMask отключён. Пожалуйста, выберите аккаунт.');
      } else {
        try {
          const signer = await provider.getSigner();
          const address = await signer.getAddress();
          setAccount(address);

          const newContract = new ethers.Contract(contractAddress, contractABI, signer);
          setContract(newContract);
          setError(null);

          await checkAccess(newContract, address);
        } catch (err) {
          console.error('Ошибка при смене аккаунта:', err);
          setError('Ошибка при смене аккаунта: ' + (err.reason || err.message));
        }
      }
    };

    load();
    window.ethereum.on('accountsChanged', handleAccountsChanged);

    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-lg">
        <div className="flex items-center justify-center mb-8">
          <img src={logo} alt="Logo" className="w-20 h-20 mr-3" />
          <h1 className="text-4xl font-bold text-blue-700">Diploma Verification</h1>
        </div>

        {account && (
            <p className="text-sm text-gray-600 text-center mb-5 bg-white py-2 px-4 rounded-full shadow-sm">
              Подключен: {account.slice(0, 6)}...{account.slice(-4)}
            </p>

        )}

        {account && isAuthorized && (
          <>
            <p className="text-sm text-blue-700 text-center font-semibold mb-1">
              Роль: {isAdmin ? 'Администратор' : 'Университет'}
            </p>
            {university && (
              <p className="text-sm text-gray-700 text-center mb-5 italic">
                Университет: {university}
              </p>
            )}
          </>
        )}


        {!account && !loading && (
          <p className="text-center text-gray-500 mb-4">
            Пожалуйста, подключите MetaMask
          </p>
        )}

        {error && (
          <p className="text-red-500 text-center mb-4 bg-white py-2 px-4 rounded-lg shadow-sm">
            {error}
          </p>
        )}

        {loading && (
          <p className="text-blue-500 text-center mb-4 bg-white py-2 px-4 rounded-lg shadow-sm">
            Загрузка...
          </p>
        )}

        {contract && (
          <div className="space-y-6">
            {isAdmin && <ManageUniversities contract={contract} />}
            {(isAuthorized || isAdmin) && <RegisterDiploma contract={contract} />}
            <VerifyDiploma contract={contract} />
            <DiplomaInfo contract={contract} />
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
