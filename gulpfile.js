var gulp = require('gulp'),
    gutil = require('gulp-util'),
    ghpages = require('gh-pages'),
    clean = require('gulp-clean'),
    jshint = require('gulp-jshint'),
    map = require('vinyl-map'),
    istanbul = require('istanbul'),
    karma = require('karma').server,
    coveralls = require('gulp-coveralls'),
    header = require('gulp-header'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    pkg = require('./package.json'),
    browserify = require('browserify'),
    merge = require('merge-stream'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    path = require('path'),
    replace = require('gulp-replace'),
    template = require('lodash').template,
    webserver = require('gulp-webserver');

gulp.task('default', ['clean', 'lint', 'test', 'compile']);
gulp.task('dev', ['compile', 'lint', 'test', 'watch']);

gulp.task('watch', function() {
  gulp.watch('lib/**/*.js', ['test', 'lint', 'compile']);
  gulp.watch('test/spec/**/*.js', ['test']);
});

gulp.task('clean', function() {
  return gulp.src(['dist', 'lib-instrumented', 'test/coverage', 'demo-dist'], { read: false })
    .pipe(clean());
});

gulp.task('lint', function() {
  return gulp.src(['gulpfile.js', 'lib/**/*.js', 'specs/**/*.js'])
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('instrument', function() {
  return gulp.src('lib/**/*.js')
    .pipe(map(function(code, filename) {
      var instrumenter = new istanbul.Instrumenter(),
        relativePath = path.relative(__dirname, filename);
      return instrumenter.instrumentSync(code.toString(), relativePath);
    }))
    .pipe(gulp.dest('lib-instrumented'));
});

gulp.task('test', ['clean', 'instrument'], function(done) {
  karma.start({
    configFile: __dirname + '/karma.conf.js'
  });
});

gulp.task('coveralls', ['test'], function() {
  return gulp.src(['test/coverage/**/lcov.info'])
    .pipe(coveralls());
});

gulp.task('compile', ['clean'], function() {
  return browserify('./lib/bespoke-markdown.js')
    .bundle({ standalone: 'bespoke.plugins.markdown' })
    .pipe(source('bespoke-markdown.js'))
    .pipe(buffer())
    .pipe(header(template([
      '/*!',
      ' * <%= name %> v<%= version %>',
      ' *',
      ' * Copyright <%= new Date().getFullYear() %>, <%= author.name %>',
      ' * This content is released under the <%= licenses[0].type %> license',
      ' * <%= licenses[0].url %>',
      ' */\n\n'
    ].join('\n'), pkg)))
    .pipe(gulp.dest('dist'))
    .pipe(rename('bespoke-markdown.min.js'))
    .pipe(uglify())
    .pipe(header(template([
      '/*! <%= name %> v<%= version %> ',
      '© <%= new Date().getFullYear() %> <%= author.name %>, ',
      '<%= licenses[0].type %> License */\n'
    ].join(''), pkg)))
    .pipe(gulp.dest('dist'));
});


gulp.task('demo', ['deploy-dependencies'], function() {
  gulp.src('demo-ghpages')
    .pipe(webserver({
      open: true,
      livereload: true,
      directoryListing: true
    }));
});


// lists dependencies of the demo htmls
var deployDependencies = [
  'node_modules/highlight.js/styles/monokai_sublime.css',
  'node_modules/bespoke/dist/bespoke.js',
  'node_modules/bespoke-keys/dist/bespoke-keys.js',
  'node_modules/bespoke-touch/dist/bespoke-touch.js',
  'node_modules/bespoke-classes/dist/bespoke-classes.js',
  'node_modules/bespoke-progress/dist/bespoke-progress.js',
  'dist/bespoke-markdown.js'
];

gulp.task('deploy-dependencies:dynamic', ['deploy-dependencies:static'], function() {
  // changes the html files to point to the "local" dependencies
  var stream = gulp.src('demo/*.html');
  deployDependencies.forEach(function(dep) {
    var pathWithoutFileName = dep.substr(0, dep.lastIndexOf('/')),
        pathRegex = new RegExp('../' + pathWithoutFileName);
    stream = stream.pipe(replace(pathRegex, 'lib'));
  });
  return stream.pipe(gulp.dest('demo-dist'));
});

gulp.task('deploy-dependencies:static', ['compile'], function() {
  // copies over js, md, css files
  var src = gulp.src(['demo/*.js', 'demo/*.md', 'demo/*.css'])
        .pipe(gulp.dest('demo-dist')),
      lib = gulp.src(deployDependencies)
        .pipe(gulp.dest('demo-dist/lib'));

  return merge(src, lib);
})

gulp.task('deploy', ['deploy-dependencies:dynamic'], function(done) {
  ghpages.publish(path.join(__dirname, 'demo-dist'), { logger: gutil.log }, done);
});
