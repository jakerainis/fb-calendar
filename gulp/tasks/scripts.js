var gulp = require('gulp');
var include = require('gulp-include');

gulp.task('scripts', function() {
  return gulp.src('app/scripts/libs/modernizr.js')
    .pipe(gulp.dest('build/scripts/libs'));
});
