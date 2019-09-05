const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/app.jsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'app.bundle.js'
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 9000,
    historyApiFallback: true
  },
  module: {
    rules: [{
      test: /\.jsx$/,
      exclude: /(node_modules)/,
      use: ['babel-loader']
    }, {
      test: /\.scss$/,
      use: [
        'style-loader',
        'css-loader',
        {
          loader: 'postcss-loader',
          options: {
            plugins: () => require('autoprefixer')()
          }
        },
        'sass-loader'
      ]
    }]
  },
  plugins: [
    new CopyPlugin([{
      from: 'assets'
    }])
  ]
};
