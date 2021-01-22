const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
module.exports = {
  mode: 'development',
  target: 'browserslist',
  watch: false,
  entry: path.resolve(__dirname, 'src/index.js'),
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    })
  ],
  output: {
    publicPath: '',
    filename: file => {
      // console.log(Object.values(file.chunk.contentHash).join('.'))
      // console.log(`${file.chunk.runtime}.${Object.values(file.chunk.contentHash).join('.')}.js`)
      // return `${file.chunk.runtime}.${Object.values(file.chunk.contentHash).join('.')}.js`
      return '[name].js'
    },
    path: path.resolve(__dirname, 'public')
  },

  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          // 'style-loader',
          // Translates CSS into CommonJS
          MiniCssExtractPlugin.loader,
          {
            loader:'css-loader',
            options: {
              url: true
            }
          },
          'postcss-loader',
          {
            loader: "sass-loader",
            options: {
              // Prefer `dart-sass`
              implementation: require("sass"),
            }
          }
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/i,
        loader: "url-loader",
        options: {
          limit: 8192,
        },
      }
    ]
  }
}