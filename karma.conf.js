module.exports = function(config) {
  config.set({
    basePath: '',

    frameworks: ['jasmine', 'browserify'],

    files: [
      {
        pattern: 'test/fixtures/*',
        included: false,
        served: true
      },
      'test/spec/*Spec.js'
    ],

    exclude: [],

    preprocessors: {
      'test/spec/*.js': 'browserify'
    },

    reporters: ['progress'/*, 'coverage'*/],

    /*
    coverageReporter: {
      type : 'lcov',
      dir : 'test/coverage'
    },
    */

    port: 8080,

    logLevel: config.LOG_INFO,

    autoWatch: true,

    browsers: ['PhantomJS'],

    singleRun: true
  });
};
