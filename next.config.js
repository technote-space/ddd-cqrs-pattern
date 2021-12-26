const {withExpo} = require("@expo/next-adapter");
const withPlugins = require("next-compose-plugins");
const withTM = require("next-transpile-modules")([
  "react-native-web",
  "react-native-svg-web",
  "native-base",
]);

// https://github.com/Automattic/node-canvas/issues/1779#issuecomment-895885846
if (
  process.env.LD_LIBRARY_PATH == null ||
  !process.env.LD_LIBRARY_PATH.includes(
    `${process.env.PWD}/node_modules/canvas/build/Release:`,
  )
) {
  process.env.LD_LIBRARY_PATH = `${
    process.env.PWD
  }/node_modules/canvas/build/Release:${process.env.LD_LIBRARY_PATH || ''}`;
}

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig = {
  webpack5: true,
  reactStrictMode: true,
  trailingSlash: true,
  distDir: !process.env.VERCEL && process.env.NODE_ENV === 'production' ? 'build' : '.next',
  webpack: (config, {isServer}) => {
    if (!isServer) {
      config.externals.push({'./registry.server': 'var {}'})
    }

    return config;
  },
  eslint: {
    dirs: ['src']
  },
};

module.exports = withPlugins(
  [
    withBundleAnalyzer,
    withTM,
    [withExpo, {projectRoot: __dirname}],
  ],
  nextConfig
);
