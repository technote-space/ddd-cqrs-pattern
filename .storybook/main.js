const path = require('path');
const {TsconfigPathsPlugin} = require('tsconfig-paths-webpack-plugin');
const toPath = (_path) => path.join(process.cwd(), _path);

module.exports = {
  core: {
    builder: 'webpack5',
  },
  "stories": [
    "../src/**/*.stories.mdx",
    "../src/**/*.stories.tsx",
  ],
  "addons": [
    "@storybook/addon-essentials",
    "@storybook/addon-actions",
    "@storybook/addon-links",
  ],
  webpackFinal: async (config) => {
    config.resolve.plugins = [
      new TsconfigPathsPlugin({
        configFile: path.resolve(__dirname, '../tsconfig.json')
      })
    ];
    config.resolve.alias = {
      ...config.resolve.alias,
      "react-native": toPath("node_modules/react-native-web"),
      "react-native-svg": toPath("node_modules/react-native-svg-web"),
    };
    config.module.rules.push({
      test: /\.scss$/,
      use: [
        'style-loader',
        {
          loader: "css-loader",
          options: {
            importLoaders: 1,
            modules: {
              localIdentName: "[local]___[hash:base64:2]",
            },
          },
        },
        'sass-loader'
      ],
    });

    return config
  },
}
