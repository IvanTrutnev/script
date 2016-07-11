var gulp = require('gulp'),
    watch = require('gulp-watch'),
    prefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    rigger = require('gulp-rigger'),
    cssmin = require('gulp-minify-css'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    rimraf = require('rimraf'),
    browserSync = require('browser-sync'),
    swPrecache = require('sw-precache'),
    reload = browserSync.reload;

var path = {
    build: {
        html: 'build/',
        js: 'build/js/',
        css: 'build/css/',
        image: 'build/images/',
        json: 'build/'
    },
    src: {
        html: 'src/**/*.html',
        js: 'src/js/**/*.js',
        style: 'src/css/main.scss',
        image: 'src/images/**/*.*',
        json: 'src/**/*.json'
    },
    watch: {
        html: 'src/**/*.html',
        style: 'src/css/main.scss',
        js: 'src/**/*.js'
    },
    clean: './build'
};

var config = {
    server: {
        baseDir: "./build"
    },
    tunnel: true,
    host: 'localhost',
    port: 1488,
    logPrefix: "kurulev"
};

gulp.task('html:build', function() {
    gulp.src(path.src.html)
        .pipe(gulp.dest(path.build.html))
        .pipe(reload({stream: true}));
});

gulp.task('js:build', function () {
    gulp.src(path.src.js)
        .pipe(rigger())
        .pipe(gulp.dest(path.build.js))
        .pipe(reload({stream: true}));
});

gulp.task('style:build', function () {
    gulp.src(path.src.style)
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(cssmin())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.css))
        .pipe(reload({stream: true}));
});

gulp.task('image:build', function () {
    gulp.src(path.src.image)
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.build.image))
        .pipe(reload({stream: true}));
});

gulp.task('json:build', function () {
    gulp.src(path.src.json)
        .pipe(gulp.dest(path.build.json))
        .pipe(reload({stream: true}));
});

gulp.task('generate-service-worker', function(cb) {
    swPrecache.write('build/service-worker.js', {
        cacheId: 'kurulev',
        staticFileGlobs: [
            'build/**/*.*'
        ],
        stripPrefix: 'build',
        runtimeCaching: [{
            urlPattern: /^https:\/\/top.apis.google.com\/\.*/,
            handler: 'cacheFirst'
        }, {
            urlPattern: /^https:\/\/cdn.mathjax.org\/\.*/,
            handler: 'cacheFirst'
        }]
    }, cb);
});

gulp.task('build', [
    'html:build',
    'js:build',
    'style:build',
    'image:build',
    'json:build',
    'generate-service-worker'
]);

gulp.task('webserver', function () {
    browserSync(config);
});

gulp.task('watch', function() {
    watch([path.watch.html], function(event, cb) {
        gulp.start('html:build');
    });
    watch([path.watch.js], function(event, cb) {
        gulp.start('js:build');
    });
    watch([path.watch.style], function(event, cb) {
        gulp.start('style:build');
    });
});

gulp.task('clean', function (cb) {
    rimraf(path.clean, cb);
});

gulp.task('default', ['build', 'webserver', 'watch']);


