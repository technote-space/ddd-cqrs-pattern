import 'reflect-metadata';
import '@testing-library/jest-dom/extend-expect';
import { Crypto } from '@peculiar/webcrypto';

Object.defineProperty(global.self, 'crypto', {
  value: new Crypto(),
});
process.env.TZ = 'Asia/Tokyo';
