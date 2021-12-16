module.exports = {
  presets: ['@expo/next-adapter/babel'],
  plugins: [
    ["@babel/plugin-proposal-class-properties", {loose: true}],
    ["@babel/plugin-proposal-private-methods", {loose: true}],
    ["@babel/plugin-proposal-private-property-in-object", {loose: true}],
    ["@babel/plugin-proposal-async-generator-functions"],
    'babel-plugin-transform-typescript-metadata',
    ['@babel/plugin-proposal-decorators', {
      legacy: true,
    }],
    ['react-native-web', {commonjs: true}],
  ],
};
