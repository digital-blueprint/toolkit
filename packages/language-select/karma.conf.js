// Trick to use the auto-downloaded puppeteer chrome binary
process.env.CHROME_BIN = require('puppeteer').executablePath();

module.exports = function(config) {
  config.set({
    basePath: 'dist',
    frameworks: ['mocha', 'chai'],
    files: [
      './bundle.js',
      {pattern: './**/*', included: false, watched: true, served: true},
    ],
    autoWatch: true,
    browsers: ['ChromeHeadlessNoSandbox'],
    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox']
      }
    },
    singleRun: false,
    logLevel: config.LOG_ERROR
  });
}
