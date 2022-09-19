const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const entry = [
  './client/index.js'
];

const output = {
  path: path.resolve(__dirname, 'dist'),
  publicPath: '/dist/',
  filename: 'bundle.js',
};

module.exports = {
  mode: 'development',
  entry,
  output,
  devtool: "eval-source-map",
  module: {
    rules:[
      {
        test: /.(js|jsx)$/,
        exclude: /node_modules/,
        use:{
          loader: 'babel-loader',
        }
      }
    ]
  },
  devServer: {
    static: {
      publicPath: '/',
      directory: path.resolve(__dirname)
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
     title: 'Development',
     template: 'index.html'
    }),
  ],
};    
          