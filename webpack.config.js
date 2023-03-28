const path = require('path');
const webpack = require('webpack');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

// First check if we can load Comunica form cwd, if not, fallback to the default
let pathToComunica;
let comunicaOverride;
try {
  pathToComunica = require.resolve('@comunica/query-sparql', { paths: [process.cwd()] });
  comunicaOverride = true;
}
catch {
  pathToComunica = require.resolve('@comunica/query-sparql', { paths: [__dirname] });
  comunicaOverride = false;
}

// Make this an object so we can mutate it from the top level of the config
// and have the options propagated to the plugins
const baseURL = {
  search: '<%= baseURL %>',
  // Default to the localhost for dev mode. The generate.js script should replace this
  // value in production mode.
  replace: 'http://localhost:8080/',
  flags: 'g'
}

module.exports = [
  {
    entry: [
      path.join(__dirname, './deps/jquery-2.1.0.js'),
      path.join(__dirname, './deps/chosen-1.1.0.js'),
      path.join(__dirname, './deps/fast-scroller.js'),
      path.join(__dirname, './src/ldf-client-ui.js'),
      path.join(__dirname, './src/ldf-client-url-state.js'),
      path.join(__dirname, './index.html'),
      path.join(__dirname, './styles/ldf-client.css'),
      path.join(__dirname, './images/chosen-sprite.png'),
      path.join(__dirname, './images/chosen-sprite@2x.png'),
      path.join(__dirname, './images/graphql.svg'),
      path.join(__dirname, './images/logo.svg'),
      path.join(__dirname, './images/settings.svg'),
      path.join(__dirname, './images/sparql.png'),
      path.join(__dirname, './favicon.ico'),
      path.join(__dirname, './solid-client-id.jsonld'),
      path.join(process.cwd(), './queries.json'),
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
      new webpack.NormalModuleReplacementPlugin(/^comunica-packagejson$/, (process.platform === 'win32' ? '' : '!!json-loader!') + path.join(pathToComunica, '../../package.json')),
    ],
    module: {
      rules: [
        {
          test: /\.js$/,
          loader: 'babel-loader',
          exclude: /node_modules/,
        },
        {
          type: 'javascript/auto',
          test: /query-sparql\/package\.json$/,
          use: [
            { loader: 'file-loader', options: { name: 'scripts/[name].[ext]' } },
          ],
        },
        {
          type: 'javascript/auto',
          test: /\.html$/,
          use: [
            { loader: require.resolve('file-loader'), options: { name: '[name].[ext]' } },
          ],
        },
        {
          type: 'javascript/auto',
          test: /queries\.json$/,
          use: [
            { loader: require.resolve('file-loader'), options: { name: '[name].[ext]' } },
          ],
        },
        {
          type: 'javascript/auto',
          test: /solid-client-id\.jsonld$/,
          use: [
            { loader: require.resolve('file-loader'), options: { name: '[name].[ext]' } },
          ],
        },
        {
          type: 'javascript/auto',
          test: /((solid-client-id\.jsonld)|(\.js))$/,
          use: [
            {
              loader: require.resolve('string-replace-loader'),
              options: baseURL
            },
          ],
        },
        {
          test: /\.(jpg|png|gif|svg|ico)$/,
          use: [
            { loader: require.resolve('file-loader'), options: { name: 'images/[name].[ext]' } },
          ],
        },
        {
          test: /\.css$/,
          use: [
            { loader: require.resolve('file-loader'), options: { name: 'styles/[name].[ext]' } },
          ],
        },
        { test: /images\/*\.svg$/, use: require.resolve('file-loader') },
        {
          test: /leaflet.*\.png$/,
          use: [
            { loader: require.resolve('file-loader'), options: { name: 'styles/images/[name].[ext]' } },
          ],
        },
      ],
    },
  },
  {
    entry: [
      path.join(__dirname, './src/ldf-client-worker.js'),
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
      ],
    },
    plugins: [
      new webpack.ProgressPlugin(),
      new NodePolyfillPlugin({
        includeAliases: ['Buffer'], // Buffer global is still needed due to the jsonparser library
      }),
      new webpack.NormalModuleReplacementPlugin(/^my-comunica-engine$/, path.join(process.cwd(), '.tmp-comunica-engine.js')),
      ...comunicaOverride ? [] : [
        new webpack.NormalModuleReplacementPlugin(/^\@comunica/, (resource) => {
          resource.context = __dirname;
        }),
      ],
    ],
    resolveLoader: {
      modules: ['node_modules', path.resolve(__dirname, 'node_modules')],
    },
  },
];

// Export the baseURL object so we can mutated it
// in the generate script
module.exports.baseURL = baseURL;
