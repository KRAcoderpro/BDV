import React, { useState } from 'react';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { parseError } from '../utils/parseError';

const VerifyDiploma = ({ contract }) => {
  const [hash, setHash] = useState('');
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const verify = async () => {
    if (!hash) {
      setError('Введите хеш диплома');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const result = await contract.verifyDiploma(hash);
      setStatus(result);
    } catch (err) {
      setError(parseError('Ошибка проверки диплома', err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center mb-4">
        <FaCheckCircle className="text-blue-600 text-xl mr-2" />
        <h2 className="text-xl font-semibold text-gray-800">Проверка диплома</h2>
      </div>
      {error && (
        <div className="text-red-600 border border-red-300 bg-red-50 p-2 rounded text-sm text-center mb-2">
          {error}
        </div>
      )}
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Хеш диплома"
          value={hash}
          onChange={(e) => setHash(e.target.value)}
          className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
        />
        <button
          onClick={verify}
          disabled={loading}
          className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 transition-colors duration-200 flex items-center justify-center"
        >
          {loading ? (
            <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : null}
          {loading ? 'Проверка...' : 'Проверить'}
        </button>
        {status !== null && (
          <p className={`text-sm flex items-center justify-center ${status ? 'text-green-600' : 'text-red-600'}`}>
            {status ? <FaCheckCircle className="mr-1" /> : <FaTimesCircle className="mr-1" />}
            {status ? 'Действителен' : 'Недействителен'}
          </p>
        )}
      </div>
    </div>
  );
};

export default VerifyDiploma;
