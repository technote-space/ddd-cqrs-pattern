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

module.exports = withBundleAnalyzer({
  webpack5: true,
  reactStrictMode: true,
  trailingSlash: true,
  distDir: !process.env.VERCEL && process.env.NODE_ENV === 'production' ? 'build' : '.next',
  webpack: (config, {isServer}) => {
    if (!isServer) {
      config.externals.push({'./registry.server': 'var {}'})
    }

    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      // Transform all direct `react-native` imports to `react-native-web`
      'react-native$': 'react-native-web',
    }
    config.resolve.extensions = [
      '.web.js',
      '.web.ts',
      '.web.tsx',
      ...config.resolve.extensions,
    ]

    return config;
  },
  eslint: {
    dirs: ['src']
  },
});
