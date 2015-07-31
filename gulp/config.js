var dest = './build';
var src = './app';

module.exports = {
	browserify: {
		// A separate bundle will be generated for each
		// bundle config in the array below
		bundleConfigs: [{
			entries: src + '/scripts/app.js',
			dest: dest + '/scripts/',
			outputName: 'app.js'
		}]
	},
	browserSync: {
		server: {
			// We're serving the src folder as well
			// for sass sourcemap linking
			baseDir: [dest, src]
		},
		notify: false, //hide the annoying notification
		files: [
			dest + '/**',
			// Exclude Map files
			'!' + dest + '/**.map'
		]
	},
	compass: {
		src: src + '/styles/sass/**/*.{sass,scss}',
		dest: dest + '/styles',
		settings: {
			bundleExec: true,
			css: dest + '/styles',
			debug: true,
			// font: src + '/fonts',
			// image: src + '/images',
			relative: false,
			require: ['breakpoint','sass-globbing', 'susy'],
			sass: src + '/styles/sass',
			sourcemap: true,
			style: 'compressed'
		}
	},
	fonts: {
		src: src + '/fonts/**',
		dest: dest + '/fonts'
	},
	images: {
		src: src + '/images/**',
		dest: dest + '/images'
	},
	markup: {
		src: src + '/**/*.html',
		dest: dest
	},
	scripts:{
		src: dest + '/scripts/app.js',
		modules: src + '/scripts/modules/**',
		dest: dest + '/scripts',
		mdrnzr: src + '/scripts/libs/modernizr.js',
		mdrnzrDest: dest + '/scripts/libs/'

	}
};
