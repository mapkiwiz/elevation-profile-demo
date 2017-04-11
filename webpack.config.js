const path = require('path');
const webpack = require('webpack');
const argv = require('yargs').argv;
const _ = require('lodash');

/*
 * Webpack Plugins
 */
// problem with copy-webpack-plugin
var CopyWebpackPlugin = (CopyWebpackPlugin = require('copy-webpack-plugin'), CopyWebpackPlugin.default || CopyWebpackPlugin);
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ForkCheckerPlugin = require('awesome-typescript-loader').ForkCheckerPlugin;
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const ENV = argv['env'] || 'dev';
var apps = [ 'index', 'list', 'map', 'upload', 'vectiles', 'labels', 'panels' ];

function loadApp(appName) {
  /*
   * Plugin: HtmlWebpackPlugin
   * Description: Simplifies creation of HTML files to serve your webpack bundles.
   * This is especially useful for webpack bundles that include a hash in the filename
   * which changes every compilation.
   *
   * See: https://github.com/ampedandwired/html-webpack-plugin
   */
  return new HtmlWebpackPlugin({
    unsupportedBrowser: true,
    template: 'src/client/index.html',
    chunksSortMode: 'dependency',
    appMountId: 'main',
    devServer: true,
    mobile: true,
    filename: appName + '.html',
    excludeChunks: _.reject(apps, app => (app == appName))
  });
}

module.exports = {

  metadata: {
    title: 'Cartographie de l\'espace de bon fonctionnement',
    baseUrl: argv['base'] || '/'
  },

  entry: {
    polyfills: './src/client/polyfills/index',
    styles: './src/client/styles',
    vendor: './src/client/vendor',
    index: './src/client/app/index',
//    list: './src/client/tests/entries/list',
//    map: './src/client/tests/entries/map',
//    upload: './src/client/tests/entries/upload/upload.js',
//    vectiles: './src/client/tests/entries/vectiles',
//    labels: './src/client/tests/entries/labels',
//    panels: './src/client/tests/entries/panels',
  },

  output: {
    path: path.resolve(__dirname, 'dist/' + ENV),
    publicPath: argv['base'] || '/',
    filename: '[name].js'
  },

  resolve: {
    extensions: ['', '.js', '.jsx', '.ts', '.tsx']
  },

  devtool: 'source-map', // if we want a source map

  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        query: {
          cacheDirectory: true
        }
      },
      {
        test: /\.tsx?$/,
        loader: 'babel!awesome-typescript-loader',
        exclude: /node_modules/
      },
      {
        test: /\.coffee$/,
        loader: 'babel!coffee-loader'
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.ya?ml$/,
        loader: 'json!yaml'
      },
      { test: /\.css$/,
        loader: ExtractTextPlugin.extract("style-loader", "css-loader")
      },
      {
        test: /\.rt$/,
        loader: "babel"
      },
      {
        test: [ /\.svg$/, /\.png$/, /\.jpg$/, /\.jpeg$/, /\.gif$/ ],
        loader: "file"
      },
      {
        test: [ /\.ttf$/, /\.eot$/, /\.woff2?$/ ],
        loader: "file"
      }
    ]
  },

  plugins: [

    /*
     * Plugin: ForkCheckerPlugin
     * Description: Do type checking in a separate process, so webpack don't need to wait.
     *
     * See: https://github.com/s-panferov/awesome-typescript-loader#forkchecker-boolean-defaultfalse
     */
    new ForkCheckerPlugin(),

    /*
     * Plugin: CopyWebpackPlugin
     * Description: Copy files and directories in webpack.
     *
     * Copies project static assets.
     *
     * See: https://www.npmjs.com/package/copy-webpack-plugin
     */
    new CopyWebpackPlugin([
      { from: 'src/client/data', to: 'data' },
      { from: 'node_modules/leaflet/dist/images', to: 'images' }
    ]),

    new webpack.optimize.OccurenceOrderPlugin(),

    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': (ENV === 'prod') ? JSON.stringify('production') : JSON.stringify('dev')
      }
    }),

    new webpack.optimize.CommonsChunkPlugin({ name: [ 'polyfills', 'vendor'  ].reverse() }),

    new ExtractTextPlugin('[name].css')

  ].concat(apps.map(loadApp))

};
