var gulp = require('gulp');
var include = require('gulp-include');
var config = require('../config').fonts;

gulp.task('fonts', function() {
  return gulp.src(config.src)
    .pipe(gulp.dest(config.dest));
});
