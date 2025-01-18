const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'development',
  devtool: 'source-map',

  entry: {
    content: './src/content/content.ts',
    popup: './src/popup/popup.ts',
    background: './src/background/background.ts'
  },

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    clean: true
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource'
      }
    ]
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    alias: {
      '@src': path.resolve(__dirname, 'src/'),
      '@components': path.resolve(__dirname, 'src/components/'),
      '@services': path.resolve(__dirname, 'src/services/'),
      '@utils': path.resolve(__dirname, 'src/utils/')
    }
  },

  plugins: [
    new CopyPlugin({
      patterns: [
        { 
          from: "public", 
          to: "" 
        },
        {
          from: 'src/popup/popup.html',
          to: 'popup.html'
        }
      ]
    })
  ],

  optimization: {
    splitChunks: {
      chunks: 'all',
      name: 'vendor'
    }
  },

  // Development server configuration
  devServer: {
    contentBase: './dist',
    hot: true
  }
};