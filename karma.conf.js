const path = require('path');
const webpackConfig = require('./webpack.test.config.js');
const karmaOverrides = require('./test/unit/karma/karma-overrides');
const rootDir = path.resolve(__dirname);

const customLaunchers = {
  'SL_Chrome': {
    base: 'SauceLabs',
    browserName: 'chrome',
    version: 'latest'
  },
  'SL_Firefox': {
    base: 'SauceLabs',
    browserName: 'firefox',
    version: 'latest'
  },
  'SL_Safari': {
    base: 'SauceLabs',
    browserName: 'safari',
    platform: 'OS X 10.12',
    version: 'latest'
  },
  'SL_EDGE': {
    base: 'SauceLabs',
    browserName: 'microsoftedge',
    platform: 'Windows 10',
    version: 'latest'
  },
  'SL_IE_11': {
    base: 'SauceLabs',
    browserName: 'internet explorer',
    platform: 'Windows 8.1',
    version: '11'
  },
  'SL_IE_10': {
    base: 'SauceLabs',
    browserName: 'internet explorer',
    platform: 'Windows 8',
    version: '10'
  },
  'SL_IE_9': {
    base: 'SauceLabs',
    browserName: 'internet explorer',
    platform: 'Windows 7',
    version: '9'
  },
  'SL_IE_8': {
    base: 'SauceLabs',
    browserName: 'internet explorer',
    platform: 'Windows 7',
    version: '8'
  },
};

module.exports = (config) => {
  const options = {
    basePath: './target/js',
    browsers: ['ChromeHeadless'],
    frameworks: ['karma-overrides', 'jasmine-jquery', 'jasmine'],
    files: [
      { pattern: 'test/unit/main.js', watched: false },
    ],
    preprocessors: {
      'test/unit/main.js': ['webpack', 'sourcemap'],
    },
    plugins: [
      'karma-*',
      karmaOverrides,
    ],
    reporters: ['progress', 'junit'],
    junitReporter: {
      outputDir: `${rootDir}/build2/reports/unit`,
      useBrowserName: false,
    },
    coverageReporter: {
      reporters: [
        { type: 'text' },
        { type: 'html', dir: `${rootDir}/build2/reports/coverage` }
      ],
    },

    webpack: webpackConfig,
    webpackMiddleware: {
      stats: 'errors-only'
    },
    client: {
      // Passing specific test to run
      // but this works only with `karma start`, not `karma run`.
      test: config.test,
      jasmine: {
        random: false
      }
    },
    failOnEmptyTestSuite: false,

  };

  // Karma webpack overrides
  options.webpack.entry = null;
  options.webpack.output = null;
  if (config.reporters.includes('coverage')) {
    const rules = options.webpack.module.loaders;
    const babelRule = rules.find(rule => rule.loader === 'babel-loader');
    babelRule.query.plugins = babelRule.query.plugins.concat(['babel-plugin-istanbul']);
  }

  if (process.env.TRAVIS) {
    // TODO: SauceLabs config for local development.
    options.sauceLabs = {
      testName: 'okta signin widget',
      startConnect: true,
      options: {
        // We need selenium version +2.46 for Firefox 39 and the last selenium version for OS X is 2.45.
        // TODO: Uncomment when there is a selenium 2.46 available for OS X.
        // 'selenium-version': '2.46.0'
      }
    };

    var buildLabel = 'TRAVIS #' + process.env.TRAVIS_BUILD_NUMBER + ' (' + process.env.TRAVIS_BUILD_ID + ')';

    // Karma (with socket.io 1.x) buffers by 50 and 50 tests can take a long time on IEs;-)
    options.browserNoActivityTimeout = 120000;

    options.sauceLabs.build = buildLabel;
    options.sauceLabs.startConnect = false;
    options.sauceLabs.tunnelIdentifier = process.env.TRAVIS_JOB_NUMBER;
    options.sauceLabs.recordScreenshots = true;
    options.customLaunchers = customLaunchers;
    options.browsers = Object.keys(customLaunchers);

    // Debug logging into a file, that we print out at the end of the build.
    config.loggers.push({
      type: 'file',
      filename: `${rootDir}/build2/karma.log`
    });

    if (process.env.BROWSER_PROVIDER === 'saucelabs' || !process.env.BROWSER_PROVIDER) {
      // Allocating a browser can take pretty long (eg. if we are out of capacity and need to wait
      // for another build to finish) and so the `captureTimeout` typically kills
      // an in-queue-pending request, which makes no sense.
      options.captureTimeout = 0;
    }
  }

  config.set(options);
};
