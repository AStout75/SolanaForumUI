const path = require('path');
 
module.exports = {
  entry: path.resolve(__dirname, './src/index.js'),
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
          test: /\.tsx?$/,
          loader: 'babel-loader'
      },
      {
          test: /\.js$/,
          use: ['source-map-loader'],
          enforce: 'pre'
      }
    ],
  },
  resolve: {
    extensions: ['*', '.ts', '.tsx', '.js', '.jsx'],
  },
  output: {
    path: path.resolve(__dirname, './dist/bundle'),
    filename: 'bundle.js',
    publicPath: '/',
  },
  devServer: {
    contentBase: path.resolve(__dirname, './dist/bundle'),
    historyApiFallback: true,
  },
  mode: "development",

  target: "node",
};