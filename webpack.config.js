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
const cleaning = []; // Removed until we figure out better build processing. (isDevMode) ? ["public/assets"] : ["public", "public/assets"];

const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
 
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
      filename: "js/[name].bundle.js", // Saved for later? !isDevMode ? "js/[name].bundle.js" : "js/[name].[hash].bundle.js",
      chunkFilename: "[name].bundle.js", // Also saved for later? !isDevMode ? "[name].bundle.js" : "[name].[hash].bundle.js",
      path: path.resolve(__dirname, "public/assets")
    },
    devtool: "inline-source-map",
<<<<<<< HEAD
    devServer: {
=======
    /*devServer: {
>>>>>>> 42ceb8f6e845eb6f375d41362ae9ee69b787136f
      contentBase: path.join(__dirname, "public"),
      compress: true,
      port: 3000
    },*/
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
        },
        /*{
          test: /\.html$/,
          use: [ {
            loader: 'html-loader',
            options: {
              minimize: true,
              removeComments: true,
              collapseWhitespace: true,
              outputPath: './',
            }
          }],
        },*/
        {
          test: /\.html$/,
          use: ['file-loader?name=[name].[ext]', 'extract-loader', 'html-loader'],
        }
      ]
    },
    plugins: [
      new CleanWebpackPlugin(cleaning, {watch: true, beforeEmit: true}),
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
        filename: "[name].bundle.css", // Saved for later? !isDevMode ? "[name].bundle.css" : "[name].[contenthash].bundle.css",
        chunkFilename: "[id].bundle.css" // Saved for later? !isDevMode ? "[id].bundle.css" : "[id].[contenthash].bundle.css"
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
      new CopyWebpackPlugin([{
        context: './src/',
        from: "**/*.html",
        to: "../",
      }]),
      /*new WebpackPwaManifest({
        filename: "manifest.json",
        orientation: "portrait",
        display: "standalone",
        start_url: ".",
        inject: true,
        fingerprints: true,
        ios: true,
        publicPath: './public',
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
      new BrowserSyncPlugin({
        // browse to http://localhost:3000/ during development,
        // ./public directory is being served
        host: 'localhost',
        port: 80,
        server: { baseDir: ['public'] }
      })
    ]
  };
};
