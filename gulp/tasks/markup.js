var gulp = require('gulp');
var include = require('gulp-include');
var config = require('../config').markup;

gulp.task('markup', function() {
  return gulp.src(config.src)
  	.pipe(include())
    .pipe(gulp.dest(config.dest));
});
