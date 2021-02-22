module.exports = function(config) {
    config.set({
      basePath: 'dist',
      frameworks: ['mocha'],
      client: {
        mocha: {
          ui: 'tdd',
          timeout: 2000 * (process.env.CI === undefined ? 1 : 10)
        },
      },
      files: [
        {pattern: './*.js', included: true, watched: true, served: true, type: 'module'},
        {pattern: './**/*', included: false, watched: true, served: true},
      ],
      autoWatch: true,
      browsers: [
        'ChromiumHeadlessNoSandbox',
        'FirefoxHeadless',
      ],
      customLaunchers: {
        ChromiumHeadlessNoSandbox: {
          base: 'ChromiumHeadless',
          flags: ['--no-sandbox']
        }
      },
      singleRun: false,
      logLevel: config.LOG_ERROR
    });
}