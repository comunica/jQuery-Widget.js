var path = require('path');
var webpack = require('webpack');
var StringReplacePlugin = require('string-replace-webpack-plugin');

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
          test: /\.(html|json)$/,
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
    optimization: {
      minimize: true,
    },
  },
  {
    entry: [
      '@babel/polyfill',
      './src/ldf-client-worker.js',
    ],
    output: {
      filename: 'scripts/ldf-client-worker.min.js',
      path: path.join(__dirname, '/build'),
      libraryTarget: 'this', // Fixes hot loading of web worker not working in Webpack
    },
    devtool: 'cheap-module-source-map',
    module: {
      rules: [
        {
          // This is needed because our internal graphql dependency uses .mjs files,
          // and Webpack's define plugin doesn't work well with it (yet).
          // In the future this should be removed.
          type: 'javascript/auto',
          test: /\.mjs$/,
          use: []
        },
        { // This fixes a problem where the setImmediate of asynciterator would conflict with webpack's polyfill
          test: /asynciterator\.js$/,
          loader: StringReplacePlugin.replace({
            replacements: [
              {
                pattern: /if \(typeof process !== 'undefined' && !process\.browser\)/i,
                replacement: function () {
                  return 'if (true)';
                },
              },
            ] }),
        },
        {
          // Makes rdf-sink use a modularized lodash function instead of requiring lodash completely
          test: /rdf-sink\/index\.js$/,
          loader: StringReplacePlugin.replace({
            replacements: [
              {
                pattern: /lodash\/assign/i,
                replacement: function () {
                  return 'lodash.assign';
                },
              },
            ],
          }),
        },
        {
          test: /\.js$/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
              plugins: [
                require('@babel/plugin-transform-async-to-generator'),
                require('@babel/plugin-syntax-object-rest-spread'),
              ],
            },
          },
        },
      ],
    },
    optimization: {
      minimize: true,
    },
    plugins: [
      new StringReplacePlugin(),
    ],
  },
];
