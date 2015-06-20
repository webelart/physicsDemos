var gulp = require('gulp');

var uglify = require('gulp-uglify');
var concat = require('gulp-concat');

var less = require('gulp-less');
var minifyCSS = require('gulp-minify-css');
var autoprefixer = require('gulp-autoprefixer');

var gulpif = require('gulp-if');

var rename = require('gulp-rename');

var jade = require('gulp-jade');

var connect = require('gulp-connect');
var livereload = require('gulp-livereload');

var baseDir    = '';
var outputDir  = baseDir + 'static';
var baseDirExamples = outputDir + '/examples/';


gulp.task('commonCss', function () {
    return gulp.src(['src/css/build.less'])
        .pipe(less())
        .pipe(autoprefixer())
        .pipe(minifyCSS({
            noAdvanced: true,
            keepSpecialComments: 1
        }))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(outputDir + '/css'));
});

gulp.task('commonJs', function () {
    return gulp.src('src/libs/*')
        .pipe(concat('libs.min.js'))
        //.pipe(uglify())
        .pipe(gulp.dest(outputDir + '/js'));
});

gulp.task('layout', function() {
    var jade_tpl = gulp.src('src/index.jade')
        .pipe(jade());

    return jade_tpl
        .pipe(gulp.dest(outputDir))
        .pipe(connect.reload());
});


//-----------------------------
gulp.task('examplesJade', function() {
    return gulp.src('src/examples/**/*.jade')
               .pipe(jade())
               .pipe(gulp.dest(baseDirExamples));
});

gulp.task('examplesCss', function() {
    return gulp.src('src/examples/**/*.less')
               .pipe(less())
               .pipe(autoprefixer())
               .pipe(minifyCSS({
                    noAdvanced: true,
                    keepSpecialComments: 1
                }))
               .pipe(gulp.dest(baseDirExamples));
});

gulp.task('files', function() {
    return gulp.src('src/files/**')
               .pipe(gulp.dest(outputDir + '/files/'));
});

gulp.task('examplesJs', function() {
    return gulp.src('src/examples/**/*.js')
               .pipe(gulp.dest(baseDirExamples));
});

gulp.task('examplesImg', function() {
    return gulp.src('src/examples/**/img/**')
               .pipe(gulp.dest(baseDirExamples));
});


gulp.task('connect', function() {
    connect.server({
        root: 'static/',
        port: 3000,
        livereload: true
    });
});

gulp.task('watch', function () {
    gulp.watch('src/css/**/*', ['commonCss']);
    gulp.watch('src/libs/*', ['commonJs']);
    gulp.watch('src/index.jade', ['layout']);

    gulp.watch(['src/examples/**/*.jade', 'src/layouts/*.jade'], ['examplesJade']);
    gulp.watch('src/examples/**/*.less', ['examplesCss']);
    gulp.watch('src/examples/**/*.js', ['examplesJs']);
    gulp.watch('src/examples/**/img/**', ['examplesImg']);
});

gulp.task('default', ['connect', 'commonCss', 'commonJs', 'files', 'layout', 'examplesJade', 'examplesImg', 'examplesCss', 'examplesJs', 'watch']);
























