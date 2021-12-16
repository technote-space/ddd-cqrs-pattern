module.exports = {
  clearMocks: true,
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!src/pages/**',
    '!src/bin/**',
    '!**/*.example.*',
  ],
  coveragePathIgnorePatterns: [
    '\\$.+\\.ts',
  ],
  moduleNameMapper: {
    'react-native-svg': 'react-native-svg-web',
    /* Handle CSS imports (with CSS modules)
    https://jestjs.io/docs/webpack#mocking-css-modules */
    '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',

    // Handle CSS imports (without CSS modules)
    '^.+\\.(css|sass|scss)$': '<rootDir>/src/__mocks__/styleMock.js',

    /* Handle image imports
    https://jestjs.io/docs/webpack#handling-static-assets */
    '^.+\\.(jpg|jpeg|png|gif|webp|svg|mdx)$': '<rootDir>/src/__mocks__/fileMock.js',

    '^\\^/(.*)$': '<rootDir>/src/$1',
    '^\\$/(.*)$': '<rootDir>/src/domain/$1',
    '^@/(.*)$': '<rootDir>/src/infra/$1',
  },
  testMatch: ['**/?(*.)+(spec).[jt]s?(x)'],
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/.next/'],
  testEnvironment: 'jsdom',
  transform: {
    /* Use babel-jest to transpile tests with the next/babel preset
    https://jestjs.io/docs/configuration#transform-objectstring-pathtotransformer--pathtotransformer-object */
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', {presets: ['next/babel']}],
  },
  transformIgnorePatterns: [
    '^.+\\.module\\.(css|sass|scss)$',
  ],
  globalSetup: '<rootDir>/jest.global.setup.js',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  preset: 'react-native-web'
}
