const path = require("path");
const fs = require("fs");
const toml = require("toml");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

const WebpackMd5Hash = require('webpack-md5-hash');
const ManifestPlugin = require("webpack-manifest-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const WebpackPwaManifest = require("webpack-pwa-manifest");
const CleanWebpackPlugin = require("clean-webpack-plugin");

const mode = process.env.NODE_ENV || 'development';
const isDevMode = mode !== "production";
const configFile = toml.parse(fs.readFileSync("./config.toml", "utf-8"));
const manifest = configFile.manifest;
const cleaning = isDevMode ? ["static/*.*"] : ["public/*.*", "static/*.*"];

module.exports = (env, argv) => {
  return {
    mode: mode,
    watchOptions: {
      ignored: ["/node_modules/"]
    },
    optimization: {
      minimize: true,
      splitChunks: {
        chunks: "all",
      }
    },
    entry: { main: './src/assets/js/script.js' },
    output: {
      filename: !isDevMode ? "js/[name].bundle.js" : "js/[name].[hash].bundle.js",
      chunkFilename: !isDevMode ? "[name].bundle.js" : "[name].[hash].bundle.js",
      path: path.resolve(__dirname, "static/assets")
    },
    devtool: "inline-source-map",
    devServer: {
      contentBase: path.join(__dirname, "site"),
      compress: true,
      port: 3000
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader"
          }
        },
        {
          test: /\.css$/,
          use: [
            { loader: MiniCssExtractPlugin.loader },
            {
              loader: "css-loader",
              options: {
                importLoaders: 1,
                sourceMap: true,
                minimize: true
              }
            },
            {
              loader: "postcss-loader",
              options: {
                sourceMap: true
              }
            }
          ]
        },
        {
          test: /\.s?[ac]ss$/,
          use: [{
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: "css-loader",
            options: {
              importLoaders: 2,
              sourceMap: true,
              minimize: true
            }
          },
          {
            loader: "postcss-loader",
            options: {
              sourceMap: true
            }
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: true
            }
          }
          ]
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: "babel-loader"
        },
        {
          test: /\.(png|jpe?g|ttf|gif|woff)$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 8192,  // limit => file.size =< 8192 bytes ? DataURI : File
                regExp: /src\/assets\/(.+\/)/,
                name: '[name].[ext]',
                outputPath: 'img/'
              }
            }
          ]
        }
      ]
    },
    plugins: [
      new UglifyJsPlugin({
        sourceMap: true,
        cache: true,
        parallel: true,
        uglifyOptions: {
          warning: false,
          compress: true
        }
      }),
      new MiniCssExtractPlugin({
        filename: !isDevMode ? "[name].bundle.css" : "[name].[contenthash].bundle.css",
        chunkFilename: !isDevMode ? "[id].bundle.css" : "[id].[contenthash].bundle.css"
      }),
      new WebpackMd5Hash(),
      new ManifestPlugin({
        fileName: "../../data/manifest.json",
      }),
      new CompressionPlugin({
        test: /\.(js|css)/,
        algorithm: "gzip",
        threshold: 0,
        minRatio: 0.8,
        cache: true,
        asset: "[path].gz[query]"
      }),
      new CopyWebpackPlugin([{
        from: "./src/assets/img/",
        to: "img/"
      }]),
      /*new WebpackPwaManifest({
        filename: "manifest.json",
        orientation: "portrait",
        display: "standalone",
        start_url: ".",
        inject: true,
        fingerprints: true,
        ios: true,
        publicPath: '.site',
        includeDirectory: true,
        theme_color: manifest.theme_color,
        name: manifest.name,
        short_name: manifest.short_name,
        description: manifest.description,
        background_color: manifest.background_color,
        icons: [{
          src: path.resolve(manifest.iconsSrc),
          sizes: [96, 128, 192, 256, 384, 512],
        },
        {
          src: path.resolve(manifest.iconsSrc),
          sizes: "1024x1024"
        }]
      }),*/
      new CleanWebpackPlugin(cleaning, {watch: true, beforeEmit: true})
    ]
  };
};
