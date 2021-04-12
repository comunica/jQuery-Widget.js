var path = require('path');
var webpack = require('webpack');

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
      new webpack.NormalModuleReplacementPlugin(/^comunica-packagejson$/, '!!json-loader!' + require.resolve('@comunica/actor-init-sparql', { paths: [process.cwd()] }) + '/../package.json'),
    ],
    module: {
      rules: [
        {
          type: 'javascript/auto',
          test: /\.(json|html)$/,
          use: [
            { loader: require.resolve('file-loader'), options: { name: '[name].[ext]' } },
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
        {
          test: /\.mjs$/,
          type: 'javascript/auto',
        },
      ],
    },
    plugins: [
      new webpack.ProgressPlugin(),
      new webpack.NormalModuleReplacementPlugin(/^my-comunica-engine$/, path.join(process.cwd(), '.tmp-comunica-engine.js')),
    ],
  },
];
