import React, { useState } from 'react';
import '../styles/DiplomaInfo.css';
import { parseError } from '../utils/parseError';

const DiplomaInfo = ({ contract }) => {
  const [hash, setHash] = useState('');
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getInfo = async () => {
    if (!hash) {
      setError('Введите хеш диплома');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const [
        university,
        timestamp,
        studentId,
        diplomaType,
        ipfsHash,
        isValid
      ] = await contract.getDiploma(hash);

      setInfo({
        university,
        timestamp: Number(timestamp),
        studentId,
        diplomaType,
        ipfsHash,
        isValid
      });
    } catch (err) {
      setError(parseError('Ошибка получения информации о дипломе', err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="info-container">
      <h2 className="info-title">Информация о дипломе</h2>
      {error && (
        <div className="text-red-600 border border-red-300 bg-red-50 p-2 rounded text-sm text-center mb-2">
          {error}
        </div>
      )}
      <div className="info-form">
        <input
          type="text"
          placeholder="Хеш диплома"
          value={hash}
          onChange={(e) => setHash(e.target.value)}
          className="info-input"
        />
        <button
          onClick={getInfo}
          disabled={loading}
          className="info-button"
        >
          {loading ? 'Загрузка...' : 'Получить информацию'}
        </button>
        {info && (
          <div className="info-result">
            <p><strong>Университет:</strong> {info.university}</p>
            <p><strong>ID студента:</strong> {info.studentId}</p>
            <p><strong>Тип диплома:</strong> {info.diplomaType}</p>
            <p><strong>Дата регистрации:</strong> {new Date(info.timestamp * 1000).toLocaleString()}</p>
            <p><strong>Статус:</strong> {info.isValid ? 'Действителен' : 'Отозван'}</p>
            <p>
              <strong>Файл диплома:</strong>{' '}
              <a
                href={`https://ipfs.io/ipfs/${info.ipfsHash}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Скачать
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiplomaInfo;
