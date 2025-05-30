import React, { useState, useEffect } from 'react';
import '../styles/UniversityDiplomas.css';
import { parseError } from '../utils/parseError';

const UniversityDiplomas = ({ contract, account }) => {
  const [diplomas, setDiplomas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadDiplomas = async () => {
    if (!contract || !account) return;

    setLoading(true);
    setError(null);

    try {
      const diplomaHashes = await contract.getUniversityDiplomas();

      const diplomaData = await Promise.all(
        diplomaHashes.map(async (hash) => {
          try {
            const [
              university,
              timestamp,
              studentId,
              diplomaType,
              ipfsHash,
              isValid
            ] = await contract.getDiploma(hash);
            return {
              hash,
              university,
              studentId,
              diplomaType,
              ipfsHash,
              timestamp: Number(timestamp),
              isValid
            };
          } catch (err) {
            console.warn(`Не удалось загрузить диплом ${hash}:`, err);
            return null;
          }
        })
      );

      setDiplomas(diplomaData.filter(Boolean));
    } catch (err) {
      setError(parseError('Ошибка загрузки дипломов', err));
    } finally {
      setLoading(false);
    }
  };

  const revokeDiploma = async (hash) => {
    if (!contract) return;

    setError(null);

    try {
      await contract.revokeDiploma(hash);
      await loadDiplomas(); // обновить список
    } catch (err) {
      setError(parseError('Ошибка при отзыве диплома', err));
    }
  };

  useEffect(() => {
    loadDiplomas();
  }, [contract, account]);

  return (
    <div className="info-container">
      <h2 className="info-title">Добавленные дипломы</h2>
      {error && <div className="info-error">{error}</div>}
      {loading ? (
        <p className="text-center">Загрузка дипломов...</p>
      ) : diplomas.length === 0 ? (
        <p className="text-center text-gray-500">Вы ещё не добавили ни одного диплома</p>
      ) : (
        <div className="table-wrapper">
          <table className="diplomas-table">
            <thead>
              <tr>
                <th className="diplomas-th">Хеш</th>
                <th className="diplomas-th">ID Студента</th>
                <th className="diplomas-th">Тип</th>
                <th className="diplomas-th">Файл</th>
                <th className="diplomas-th">Статус</th>
                <th className="diplomas-th">Дата</th>
                <th className="diplomas-th">Действия</th>
              </tr>
            </thead>
            <tbody>
              {diplomas.map((diploma, idx) => (
                <tr key={idx} className="diplomas-tr">
                  <td className="diplomas-td">
                    <button
                      onClick={() => navigator.clipboard.writeText(diploma.hash)}
                      className="hash-button"
                      title="Скопировать хеш"
                    >
                      {diploma.hash.slice(0, 6)}...{diploma.hash.slice(-4)}
                    </button>
                  </td>
                  <td className="diplomas-td">{diploma.studentId}</td>
                  <td className="diplomas-td">{diploma.diplomaType}</td>
                  <td className="diplomas-td">
                    <a
                      href={`https://ipfs.io/ipfs/${diploma.ipfsHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      Скачать
                    </a>
                  </td>
                  <td className="diplomas-td">
                    {diploma.isValid ? (
                      <span className="text-green-600 font-medium">Действителен</span>
                    ) : (
                      <span className="text-red-600 font-medium">Отозван</span>
                    )}
                  </td>
                  <td className="diplomas-td">
                    {new Date(diploma.timestamp * 1000).toLocaleDateString()}
                  </td>
                  <td className="diplomas-td">
                    {diploma.isValid && (
                      <button
                        onClick={() => revokeDiploma(diploma.hash)}
                        className="revoke-button"
                      >
                        Отозвать
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UniversityDiplomas;
