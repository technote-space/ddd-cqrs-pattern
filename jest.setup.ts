import 'reflect-metadata';
import '@testing-library/jest-dom/extend-expect';
import { Crypto } from '@peculiar/webcrypto';

Object.defineProperty(global.self, 'crypto', {
  value: new Crypto(),
});
jest.mock('@expo/vector-icons', () => {
  const { View } = require('react-native');
  return {
    AntDesign: View,
  };
});

