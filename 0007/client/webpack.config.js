import HtmlWebpackPlugin from 'html-webpack-plugin';
import HtmlInlineScriptPlugin from 'html-inline-script-webpack-plugin';
import { merge } from 'webpack-merge';
import path from 'path';
import url from 'url';
import fs from 'fs';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const packageJson = JSON.parse(
  fs.readFileSync(path.join(__dirname, './package.json')));

const common = {
  entry: './src/index.jsx',
  output: {
    publicPath: ''
  },
  resolve: {
    extensions: [ '.js', '.jsx' ]
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.css$/i,
        //exclude: /node_modules/,
        //include: path.join(__dirname, 'src'),
        use: [ 
          {
            loader: 'style-loader'
          }, 
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1
            } 
          },
          {
            loader: 'postcss-loader' 
          }
        ]
      },
      { 
        test: /\.(csv|tsv)$/i,
        use: [ 'csv-loader' ] 
      },
      {
        test: /\.(woff|woff2|ttf)$/i,
        type: 'asset/inline'
      }
    ]
  },
  plugins: [
  ]
};

const config = (env, argv) => {
  if (argv.mode === 'production') {
    return merge(common, {
      mode: 'production',
      optimization: {
        minimize: false
      },
      plugins: [
        new HtmlWebpackPlugin({
          title: `${packageJson.name} - ${packageJson.version}`,
          template: './src/index.html',
          inject: 'body'
        }),
        new HtmlInlineScriptPlugin()
      ]
    });
  } else {
    return merge(common, {
      mode: 'development',
      devServer: {
        port: 3000
      },
      plugins: [
        new HtmlWebpackPlugin({
          title: `${packageJson.name} - ${packageJson.version} (dev)`,
          template: './src/index.html',
          inject: 'body'
        })
      ]
    });
  }
};

export default config;
