const gulp = require('gulp');
const gulpif = require('gulp-if');
const less = require('gulp-less');
const gulppostcss = require('gulp-postcss');
const postcss = require('postcss');
const argv = require('yargs').argv;
const base64 = require('gulp-base64');

//server
if(!argv.build){
    var child = require('child_process');
    var server = child.spawn('node',['./server.js']);
    server.stdout.on('data', function (data) {
        console.log(String(data).replace(/\r\n$|\r$|\n$/,''));
    });
    server.stderr.on('data', function (data) {
        console.log(String(data).replace(/\r\n$|\r$|\n$/,''));
    });
    server.on('exit', function (data) {
        console.log(String(data).replace(/\r\n$|\r$|\n$/,''));
    });
}
//默认还是沿用html为10px的情况
if(!argv.rem){
    argv.rem = 10;
}
let output = 'dist'
gulp.task(argv['_'][0], () => {
    const taskname = argv['_'];
    if(!argv.build)
        gulp.watch('src/'+ taskname +'/**/*', ['u'])

    gulp.src('src/core/gomeUI/**/*')
        .pipe(gulp.dest(output + '/cdn/gomeUI'));
    return gulp.src('src/'+ taskname +'/**/*')
            .pipe(gulpif('*.less', less()))
            .pipe(gulpif('*.css', base64({
                //100k
                maxImageSize: 100*1024,
            })))
            .pipe(gulpif('*.css', gulppostcss([
                postcss.plugin('pxtorem', () => {
                    return function(css){
                        css.walkDecls(decl => {
                            if(/(\d*?\.?\d*?)px/.test(decl.value) && !/url/.test(decl.value)){
                                var origin = decl.value.match(/(\d*?\.?\d*?)px/g)
                                var result = origin.map(function(item){
                                    var number = item.match(/(\d*?\.?\d*?)px/)[1]
                                    return item = item.replace(/(\d*?\.?\d*?)px/, (Number(number) / (2 * argv.rem)).toFixed(2) + 'rem')
                                })
                                origin.map(function(originItem, idx){
                                    decl.value = decl.value.replace(originItem, result[idx])
                                })
                                
                                //decl.value = decl.value.replace(RegExp.$1, (Number(RegExp.$1) / (2 * argv.rem)).toFixed(2)).replace(/px/g, 'rem')
                            }
                        })
                    }
                })
            ])))
            .pipe(gulpif('*.css', gulp.dest(output +  '/cdn/style/'+ taskname)))
            .pipe(gulpif('*.js', gulp.dest(output +   '/cdn/js/'+ taskname)))
            .pipe(gulpif('*.jpg', gulp.dest(output +  '/cdn/images/'+ taskname)))
            .pipe(gulpif('*.png', gulp.dest(output +  '/cdn/images/'+ taskname)))
            .pipe(gulpif('*.gif', gulp.dest(output +  '/cdn/images/'+ taskname)))
            .pipe(gulpif('*.html', gulp.dest(output + '/template/'+ taskname)));
})