var gulp           = require('gulp');
var browserifyTask = require('./browserify');

gulp.task('watchify', function() {
  //We'll uglify if it's not dev mode
  global.devMode = true;
});
