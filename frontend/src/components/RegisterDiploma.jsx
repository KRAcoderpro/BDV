import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { ipfsClient } from '../utils/ipfs';
import { parseError } from '../utils/parseError';

const RegisterDiploma = ({ contract }) => {
  const [account, setAccount] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const [university, setUniversity] = useState('');
  const [studentId, setStudentId] = useState('');
  const [diplomaType, setDiplomaType] = useState('');
  const [file, setFile] = useState(null);
  const [hash, setHash] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const checkAccess = async () => {
      if (!window.ethereum || !contract) return;

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const addr = await signer.getAddress();

      setAccount(addr);

      const admin = await contract.admin();
      const authorized = await contract.authorizedUniversities(addr);

      setIsAdmin(addr.toLowerCase() === admin.toLowerCase());
      setIsAuthorized(authorized);

      if (authorized) {
        const uniName = await contract.getUniversityName(addr);
        setUniversity(uniName);
      }
    };

    checkAccess();
  }, [contract]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const register = async () => {
    if (!file || !studentId || !diplomaType) {
      setError('Заполните все поля и выберите файл');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const result = await ipfsClient.add(file);
      const ipfsHash = result.path;
      const hashValue = ethers.sha256(ethers.toUtf8Bytes(ipfsHash));

      await contract.registerDiploma(hashValue, studentId, diplomaType, ipfsHash);

      setHash(hashValue);
      alert('Диплом успешно зарегистрирован!');
    } catch (err) {
      console.error(err);
      setError(parseError('Ошибка регистрации диплома', err));
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(hash);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error('Ошибка копирования в буфер:', err);
    }
  };

  if (!isAdmin && !isAuthorized) return null;

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold text-gray-800 mb-3 text-center">Регистрация диплома</h2>
      {error && (
        <div className="text-red-600 border border-red-300 bg-red-50 p-2 rounded text-sm text-center mb-2">
          {error}
        </div>
      )}
      <div className="space-y-3">
        <input
          type="text"
          value={university}
          disabled
          placeholder="Название университета"
          className="w-full p-2 border border-gray-300 rounded bg-gray-100 text-gray-600"
        />
        <input
          type="text"
          placeholder="ID студента"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-400"
        />
        <input
          type="text"
          placeholder="Тип диплома"
          value={diplomaType}
          onChange={(e) => setDiplomaType(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-400"
        />
        <input
          type="file"
          id="diplomaFile"
          onChange={handleFileChange}
          className="w-full p-2 border border-gray-300 rounded"
        />
        <button
          onClick={register}
          disabled={loading}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-300"
        >
          {loading ? 'Регистрация...' : 'Зарегистрировать'}
        </button>
        {hash && (
          <div className="mt-3 p-2 bg-gray-50 rounded flex items-center justify-between">
            <p className="text-sm text-gray-700 font-medium">Hash диплома:</p>
            <button
              onClick={copyToClipboard}
              className="ml-4 px-3 py-1 text-sm text-white bg-blue-500 rounded hover:bg-blue-600"
            >
              {copied ? 'Скопировано!' : 'Копировать'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisterDiploma;
