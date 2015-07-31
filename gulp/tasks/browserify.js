'use strict';
/* browserify task
     ---------------
     Bundle javascripty things with browserify!

     This task is set up to generate multiple separate bundles, from
     different sources, and to use Watchify when run from the default task.

     See browserify.bundleConfigs in gulp/config.js
*/

var browserify   = require('browserify');
var browserSync  = require('browser-sync');
var buffer       = require('vinyl-buffer');
var bundleLogger = require('../util/bundleLogger');
var config       = require('../config').browserify;
var gulp         = require('gulp');
var gulpif       = require('gulp-if');
var gutil        = require('gulp-util');
var handleErrors = require('../util/handleErrors');
var mergeStream  = require('merge-stream');
var source       = require('vinyl-source-stream');
var sourcemaps   = require('gulp-sourcemaps');
var uglify       = require('gulp-uglify');
var watchify     = require('watchify');
var _            = require('underscore');


var browserifyTask = function() {

    var browserifyThis = function(bundleConfig) {

        if(global.devMode) {

            // Add watchify args and debug (sourcemaps) option
            _.extend(bundleConfig, watchify.args, { debug: true });
            // A watchify require/external bug that prevents proper recompiling,
            // so (for now) we'll ignore these options during development. Running
            // `gulp browserify` directly will properly require and externalize.
            bundleConfig = _.omit(bundleConfig, ['external', 'require']);
        }

        var b = browserify(bundleConfig);

        var bundle = function() {
            // Log when bundling starts
            bundleLogger.start(bundleConfig.outputName);

            return b
                .bundle()
                .on('error', handleErrors)
                // Use vinyl-source-stream to make the
                // stream gulp compatible. Specifiy the
                // desired output filename here.
                .pipe(source(bundleConfig.outputName))
                .pipe(buffer())
                .pipe(sourcemaps.init({loadMaps: true}))

                //.on('end', function(){ gutil.log(global.devMode);  })
                //Only uglify in prod
                .pipe(gulpif(!global.devMode, uglify()))
                .on('error', gutil.log)

                .pipe(sourcemaps.write('./'))
                // Specify the output destination
                .pipe(gulp.dest(bundleConfig.dest))
                .pipe(browserSync.reload({
                    stream: true
                }));
        };

        if(global.devMode) {
            // Wrap with watchify and rebundle on changes
            b = watchify(b);
            // Rebundle on update
            b.on('update', bundle);
            // bundleLogger.watch(bundleConfig.outputName);
        } else {
            // Sort out shared dependencies.
            // b.require exposes modules externally
            if(bundleConfig.require) {
                b.require(bundleConfig.require);
            }
            // b.external excludes modules from the bundle, and expects
            // they'll be available externally
            if(bundleConfig.external) {
                b.external(bundleConfig.external);
            }
        }

        return bundle();
    };

    // Start bundling with Browserify for each bundleConfig specified
    return mergeStream.apply(gulp, _.map(config.bundleConfigs, browserifyThis));

};

gulp.task('browserify', function() {
     browserifyTask();
});

// Exporting the task so we can call it directly in our watch task, with the 'devMode' option
module.exports = browserifyTask;
