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
      './images/logo.svg',
      './images/memento.svg',
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
          test: /\.(html|json)$/,
          use: [
            { loader: 'file-loader', options: { name: 'build/[name].[ext]' } },
          ],
        },
        {
          test: /\.(jpg|png|gif|svg|ico)$/,
          use: [
            { loader: 'file-loader', options: { name: 'build/images/[name].[ext]' } },
          ],
        },
        {
          test: /\.css$/,
          use: [
            { loader: 'file-loader', options: { name: 'build/styles/[name].[ext]' } },
          ],
        },
        { test: /images\/*\.svg$/, use: 'file-loader' },
      ],
    },
  },
  {
    entry: [
      'babel-polyfill',
      './src/ldf-client-worker.js',
    ],
    output: {
      filename: 'scripts/ldf-client-worker.min.js',
      path: path.join(__dirname, '/build'),
      libraryTarget: 'this', // Fixes hot loading of web worker not working in Webpack
    },
    devtool: 'cheap-module-source-map',
    module: {
      loaders: [
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
        { // This fixes an issue where UglifyJS would fail because labeled declarations are not allowed in strict mode
          // This is a problem that should be fixed in jison: https://github.com/zaach/jison/issues/351
          test: /SparqlParser\.js$/,
          loader: StringReplacePlugin.replace({
            replacements: [
              {
                pattern: /_token_stack:/i,
                replacement: function () {
                  return '';
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
            ] }),
        },
        {
          test: /\.js$/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['es2015'],
              plugins: [
                require('babel-plugin-transform-async-to-generator'),
                require('babel-plugin-transform-object-rest-spread'),
              ],
            },
          },
        },
      ],
    },
    plugins: [
      new StringReplacePlugin(),
    ],
  },
];
