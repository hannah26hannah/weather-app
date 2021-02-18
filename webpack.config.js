const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const path = require("path");

module.exports = {
  entry: './assets/js/main.js',
  mode: 'none',
  output: {
	path: path.resolve(`${__dirname}/dist`),
	filename: 'bundle.js',
    },
  module: {
        rules: [
          {
            test: /\.css$/,
            exclude: "/node_modules",
            use: [
                { loader: MiniCssExtractPlugin.loader },
                'css-loader'
            ]
          },
          {
              test: /\.(jpe?g|png|gif|svg)$/i,
              loader: 'file-loader',
              options: {
                  name: '[name].[ext]'
              }
          }
      ]
  },
  devServer: {
    contentBase: path.join(__dirname, "./dist/"),
    port: 9003
  },
  plugins: [
        new MiniCssExtractPlugin({
            filename: 'style.css'
        }),
        new HtmlWebpackPlugin({
            template: './index.html',
            filename: 'index.html',
            minify: {
                collapseWhitespace: true
            },
            hash: true,
            favicon: './weather_2.png'
        })
   ],
   resolve: {
        modules: ['node_modules'],
        extensions: ['.js', '.json', '.jsx', '.css']
   } 
};