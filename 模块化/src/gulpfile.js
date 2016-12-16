var gulp = require('gulp');

var gulpLithe = require('./gulp-lithe-master/app.js');
var cssImageLink = require('./gulp-lithe-master/css-image-link.js');
var jsUglifyPre = require('./gulp-lithe-master/js-uglify-pre.js');
var path = require('path');
var concat = require('gulp-concat');
var minifycss = require('gulp-minify-css');
var gulpUtil = require('gulp-util');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var litheConfig = require('./js/config.js');  // lithe config
litheConfig.basepath = path.resolve(__dirname,'./js/');
/*var spriter = require('gulp-css-spriter');*/
var importCss = require('gulp-cssimport');
var concat = require('gulp-concat');
var del = require('del');

var base64 = require('gulp-base64');

gulp.task('litheconcat', function() {
    return gulp
        .src(['./js/conf/**/*.js'])  // entry file
        .pipe(gulpLithe({
          config:litheConfig  // lithe config
        }))
        .pipe(gulp.dest('../temp/js/conf'))
});
gulp.task('concat', function() {
    return gulp.src(['./js/lithe.js','./js/config.js','./buriedPoint.min.js','./suda.min.js'])
    .pipe(gulp.dest('../dist/js/'));
});


gulp.task('concatconfig',["uglifyconfig","uglifylithe"], function() {
    return gulp.src(['../dist/js/lithe.js','../dist/js/config.js']).pipe(concat('lithe.min.js'))
        .pipe(gulp.dest('../dist/js/'));
});

gulp.task('moveimages', function() {
    return gulp.src('./images/**/*')
        .pipe(gulp.dest('../dist/images'));
});

gulp.task('styles',['moveimages'], function() {
    var timestamp = new Date().getTime();
    return gulp.src('./css/**/*.css')
       /* .pipe(spriter({
            'spriteSheet':'../dist/images/spritesheet'+timestamp+'.png',
            'pathToSpriteSheetFromCSS':'../../images/spritesheet'+timestamp+'.png'
        }))*/
        .pipe(importCss())
        .pipe(cssImageLink())
        .pipe(base64({
            //baseDir:'css',
            extensions: ['png'],
            maxImageSize: 20 * 1024, // bytes
            debug: false
        }))
        .pipe(minifycss())
        .pipe(gulp.dest('../dist/css'));
});

gulp.task('uglifyBP',['litheconcat','concat'], function() {
    return gulp.src(['./js/buriedPoint.js']).pipe(uglify()).pipe(rename({
            suffix: '.min'
          })).pipe(gulp.dest('./js/'));
});
gulp.task('buriedPoint',['uglifyBP'], function() {
    return gulp.src('./js/buriedPoint.min.js')
        .pipe(gulp.dest('../dist/js'));
});

/**
 * 压缩所有目标目录下的脚本文件 依赖于movefile任务
 */
gulp.task('uglify',['litheconcat','concat'], function() {
    return gulp.src(['../temp/js/**/*.js'])
        .pipe(jsUglifyPre())//丑化预处理，先判断合并后的文件与旧文件MD5是否有变化，若有，则丑化替换，若无，则不丑化，提高效率
        .pipe(uglify().on('error', gulpUtil.log))
        .pipe(gulp.dest('../dist/js/'));
});

gulp.task('uglifylithe',['litheconcat','concat'], function() {
    return gulp.src(['../dist/js/lithe.js']).pipe(uglify()).pipe(gulp.dest('../dist/js/'));
});

gulp.task('uglifyconfig',['litheconcat','concat'], function() {
    return gulp.src(['../dist/js/config.js']).pipe(uglify()).pipe(gulp.dest('../dist/js/'));
});

/**
 * 清空临时目录
 */
gulp.task('cleantemp',['uglify'], function(cb) {
    return del(['../temp'],{force:true});
});

gulp.on('error',gulpUtil.log);

gulp.task('default',['litheconcat','concatconfig','uglify','concat','moveimages','styles','uglifyBP','buriedPoint','uglifylithe','uglifyconfig','cleantemp']);
