const gulp = require('gulp');
// import { src, dest, series, parallel } from 'gulp';

const pug = require('gulp-pug');
const sass = require('gulp-sass');
const autoPrefixer = require('gulp-autoprefixer');
const cssnano = require('gulp-cssnano');
const uglify = require('gulp-uglify-es').default;
const rename = require('gulp-rename');
const image = require('gulp-image');
const browserSync = require('browser-sync').create();
const clean = require('gulp-clean');

const paths = {
    pug: {
        src: 'src/*.pug',
        dest: 'build',
    },
    styles: {
        src: 'src/styles/**/*.scss',
        dest: 'build/styles',
    },
    /* js: {
        src: 'src/js/*.js',
        dest: 'build/js',
    }, */
    fonts: {
        src: 'src/fonts/**/*.ttf',
        dest: 'build/fonts',
    },
    images: {
        src: 'src/img/*.*',
        dest: 'build/img',
    }
}

function browser(done) {
    browserSync.init({
        server: {
            baseDir: './build'
        },
        port: 3000
    });
    done();
}

function browserReload(done) {
    browserSync.reload();
    done();
}

// ==========================
// Builds

function buildHTML() {
    return gulp.src(paths.pug.src)
        .pipe(pug())
        .pipe(gulp.dest(paths.pug.dest))
        .pipe(browserSync.stream());
}

function buildCss() {
    return gulp.src(paths.styles.src)
        .pipe(sass()).on('error', sass.logError)
        .pipe(autoPrefixer())
        .pipe(cssnano())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(paths.styles.dest))
        .pipe(browserSync.stream());
}

/* function buildJs() {
    return gulp.src(paths.js.src)
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(paths.js.dest))
        .pipe(browserSync.stream());
} */

function buildFonts() {
    return gulp.src(paths.fonts.src)
        .pipe(gulp.dest(paths.fonts.dest))
        .pipe(browserSync.stream());
}

function buildImages() {
    return gulp.src(paths.images.src)
        .pipe(image())
        .pipe(gulp.dest(paths.images.dest))
        .pipe(browserSync.stream());
}

function watch() {
    gulp.watch(paths.pug.src, buildHTML);
    gulp.watch(paths.styles.src, buildCss);
    gulp.watch(paths.js.src, buildJs);
    gulp.watch(paths.images.src, buildImages);
}

function cleanBuild() {
    return gulp.src('build', { read: false, allowEmpty: true })
        .pipe(clean());
}

const build = gulp.series(cleanBuild, gulp.parallel(buildHTML, buildCss, buildFonts,/* buildJs, */ buildImages));

gulp.task('build', build);

gulp.task('default', gulp.parallel(watch, build, browser));