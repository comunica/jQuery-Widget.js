var path = require('path');
var webpack = require('webpack');

// Generate queries.json file
require('./queries-to-json');

module.exports = [
  {
    entry: [
      './deps/jquery-2.1.0.js',
      './deps/chosen-1.1.0.js',
      './deps/fast-scroller.js',
      './src/ldf-client-ui.js',
      './src/ldf-client-url-state.js',
      './index.html',
      './styles/ldf-client.css',
      './images/chosen-sprite.png',
      './images/chosen-sprite@2x.png',
      './images/graphql.svg',
      './images/logo.svg',
      './images/settings.svg',
      './images/sparql.png',
      './favicon.ico',
      './queries.json',
    ],
    output: {
      filename: 'scripts/ldf-client-ui.min.js',
      path: path.join(__dirname, '/build'),
      libraryTarget: 'window',
    },
    plugins: [
      new webpack.ProvidePlugin({
        jQuery: path.join(__dirname, '/deps/jquery-2.1.0.js'),
      }),
    ],
    module: {
      rules: [
        {
          type: 'javascript/auto',
          test: /\.html$/,
          use: [
            { loader: 'file-loader', options: { name: '[name].[ext]' } },
          ],
        },
        {
          test: /\.(jpg|png|gif|svg|ico)$/,
          use: [
            { loader: 'file-loader', options: { name: 'images/[name].[ext]' } },
          ],
        },
        {
          test: /\.css$/,
          use: [
            { loader: 'file-loader', options: { name: 'styles/[name].[ext]' } },
          ],
        },
        { test: /images\/*\.svg$/, use: 'file-loader' },
      ],
    },
  },
  {
    entry: [
      './src/ldf-client-worker.js',
    ],
    output: {
      filename: 'scripts/ldf-client-worker.min.js',
      path: path.join(__dirname, '/build'),
      libraryTarget: 'this', // Fixes hot loading of web worker not working in Webpack
    },
    devtool: 'source-map',
    module: {
      rules: [
        {
          test: /\.js$/,
          loader: 'babel-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.mjs$/,
          type: 'javascript/auto',
        },
      ],
    },
    plugins: [
      new webpack.ProgressPlugin(),
    ],
  },
];
