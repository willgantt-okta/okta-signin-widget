/* global module __dirname */
var path = require('path');
var WIDGET_SRC = path.resolve(__dirname, 'target/js');
var EMPTY = WIDGET_SRC + '/widget/empty';
var SHARED_JS = path.resolve(__dirname, 'node_modules/@okta/courage/src');
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const EXTERNAL_PATHS = [
  'jquery', 
  'qtip', 
  'backbone',
  'underscore',
  'handlebars',
  'moment',
  'shared/util/Bundles'
];

const EXTERNALS = EXTERNAL_PATHS.reduce((init, pathName) => {
  return Object.assign(init, {[pathName]: {
    'commonjs': pathName,
    'commonjs2': pathName,
    'amd': pathName,
    'root': pathName
  }});
}, {});
EXTERNALS.jquery.root = 'jQuery';

var webpackConfig = {
  entry: ['./buildtools/courage/OktaForSigninWidget.js'],
  devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, 'packages/@okta/courage-for-signin-widget/dist'),
    filename: 'okta-for-signin-widget.js',
    libraryTarget: 'umd',
    library: 'okta-for-signin-widget'
  },
  externals: EXTERNALS,
  resolve: {
    root: '.',
    modulesDirectories: ['node_modules'],
    alias: {

      'okta/jquery': SHARED_JS + '/util/jquery-wrapper',
      'okta/underscore': SHARED_JS + '/util/underscore-wrapper',
      'okta/handlebars': SHARED_JS + '/util/handlebars-wrapper',
      'okta/moment': SHARED_JS + '/util/moment-wrapper',

      // jsons is from StringUtil
      'vendor/lib/json2': EMPTY,
      
      // simplemodal is from dependency chain: 
      //   BaseRouter -> ConfirmationDialog -> BaseFormDialog -> BaseModalDialog -> simplemodal
      'vendor/plugins/jquery.simplemodal': EMPTY,

      'shared': SHARED_JS,
      'vendor': SHARED_JS + '/vendor',
    }
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['env'],
        }
      },
    ]
  },

  plugins: [
    new BundleAnalyzerPlugin({
      openAnalyzer: false,
      reportFilename: 'OktaForSigninWidget.html',
      analyzerMode: 'static',
    })
  ]

};

module.exports = webpackConfig;
