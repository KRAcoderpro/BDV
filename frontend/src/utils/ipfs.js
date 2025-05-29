import { create } from 'ipfs-http-client';

// Конфигурация IPFS: локальный или публичный шлюз
const ipfsConfig = {
  local: {
    host: '127.0.0.1',
    port: 5001,
    protocol: 'http',
  },
  infura: {
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
  },
};

// Выбираем конфигурацию (локальная по умолчанию, можно переключить на Infura)
const config = process.env.REACT_APP_IPFS_ENV === 'infura' ? ipfsConfig.infura : ipfsConfig.local;

export const ipfsClient = create(config);
