const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: {
    bluffer: ['./src/client/index.js', './style/bluffer.scss'],
  },
  output: {
    filename: 'dist/[name].js',
  },
  module: {
    loaders: [
      { test: /\.js$/, loaders: ['react-hot-loader', 'jsx-loader', 'babel-loader'], exclude: /node_modules/ },
      { test: /\.scss$/, loader: ExtractTextPlugin.extract('css-loader!sass-loader') },
    ],
  },
  plugins: [
    new ExtractTextPlugin({ filename: 'dist/bluffer.css', allChunks: true }),
  ],
};
