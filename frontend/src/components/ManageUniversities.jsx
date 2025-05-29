import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { parseError } from '../utils/parseError';

const ManageUniversities = ({ contract }) => {
  const [account, setAccount] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [inputAddress, setInputAddress] = useState('');
  const [universityName, setUniversityName] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkAdmin = async () => {
      if (!window.ethereum || !contract) return;
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const addr = await signer.getAddress();

      setAccount(addr);
      const admin = await contract.admin();
      setIsAdmin(addr.toLowerCase() === admin.toLowerCase());
    };

    checkAdmin();
  }, [contract]);

  const handleAuthorize = async () => {
    setError(null);
    setStatus('');

    if (!ethers.isAddress(inputAddress)) {
      setError('Введите корректный адрес');
      return;
    }

    if (!universityName.trim()) {
      setError('Введите название университета');
      return;
    }

    try {
      setLoading(true);

      const tx = await contract.authorizeUniversity(
        inputAddress,
        universityName.trim()
      );
      await tx.wait();

      setStatus('Университет авторизован');
    } catch (err) {
      console.error(err);
      setError(parseError('Ошибка авторизации', err));
    } finally {
      setLoading(false);
    }
  };

  const handleRevoke = async () => {
    setError(null);
    setStatus('');

    if (!ethers.isAddress(inputAddress)) {
      setError('Введите корректный адрес');
      return;
    }

    try {
      setLoading(true);
      const tx = await contract.revokeUniversity(inputAddress);
      await tx.wait();
      setStatus('Университет отозван');
    } catch (err) {
      console.error(err);
      setError(parseError('Ошибка отзыва', err));
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) return null;

  return (
    <div className="bg-white p-4 mt-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold text-gray-800 mb-3 text-center">
        Управление университетами
      </h2>

      {error && (
        <div className="text-red-600 border border-red-300 bg-red-50 p-2 rounded text-sm text-center mb-2">
          {error}
        </div>
      )}
      {status && (
        <div className="text-green-700 border border-green-300 bg-green-50 p-2 rounded text-sm text-center mb-2">
          {status}
        </div>
      )}

      <div className="space-y-3">
        <input
          type="text"
          placeholder="Адрес университета (0x...)"
          value={inputAddress}
          onChange={(e) => setInputAddress(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-400"
        />
        <input
          type="text"
          placeholder="Название университета"
          value={universityName}
          onChange={(e) => setUniversityName(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-400"
        />
        <div className="flex gap-2">
          <button
            onClick={handleAuthorize}
            disabled={loading}
            className="flex-1 bg-green-500 text-white p-2 rounded hover:bg-green-600 disabled:bg-gray-300"
          >
            Авторизовать
          </button>
          <button
            onClick={handleRevoke}
            disabled={loading}
            className="flex-1 bg-red-500 text-white p-2 rounded hover:bg-red-600 disabled:bg-gray-300"
          >
            Отозвать
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageUniversities;
