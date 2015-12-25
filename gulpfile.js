var gulp=require('gulp'),
    less=require('gulp-less'),
    concat=require('gulp-concat'),
    sass=require('gulp-sass'),
    watch=require('gulp-watch'),
    clean=require('gulp-clean'),
    cssmin=require('gulp-minify-css'),
    js=require('gulp-requirejs-optimize'),
    autoprefix=require('gulp-autoprefixer'),
    spriter = require('gulp-css-spriter'),
    ftp = require('gulp-ftp');

var webpack=require('webpack');

/**
 * 使用gulp-autoprefixer根据设置浏览器版本自动处理浏览器前缀。使用她我们可以很潇洒地写代码，不必考虑各浏览器兼容前缀
 * */
gulp.task('less', function () {
    gulp.src('./page/css/*.less')
    .pipe(less())
    .pipe(autoprefix())
    .pipe(cssmin())
    .pipe(gulp.dest('./dist/css'));
});
gulp.task("concat", function () {
    gulp.src('./page/bootstrap/css/*.css')
    .pipe(concat("main.css"))
    .pipe(gulp.dest('./dist/css/'))
});

gulp.task('sass', function () {
    gulp.src('./page/css/**/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('./dist/css'));
});

gulp.task('jsConcat', function () {
    gulp.src('./entries/action/*.js')
    .pipe(js(function(file){
            return {
                name: 'entries/action/'+file.relative,
                optimize: 'none',
                useStrict: true,
                mainConfigfile:"entries/main.js",
                paths:{
                    "jQuery":"empty:",
                    "juicer":"empty:",
                    "text":"empty:",
                    "datetimepicker":"empty:",
                    "bootstrap":"empty:",
                    "ejs":"empty:",
                    "template":"empty:"
                },
                baseUrl: './',
                include: 'entries/main',
                exclude:['text']
            };
        }))
    .pipe(gulp.dest('./dist/js'))
});

gulp.task('spring', function () {
    var timestamp=+new Date();
    gulp.src('./dist/css/*.css')
    .pipe(spriter({
            'spriteSheet':'./dist/img/spring/sprite'+timestamp+'.png',
            'pathToSpriteSheetFromCSS':'../img/spring/sprite'+timestamp+'.png'
     }))
    .pipe(gulp.dest('./dist/css'))
});

gulp.task('copy', function () {
    gulp.src('./page/bootstrap/**/*.*')
    .pipe(gulp.dest('./dist/bootstrap/'))
});
gulp.task('clear', function () {
    gulp.src('./dist',{read:false})
    .pipe(clean())
});

gulp.task('watch', function () {
    gulp.watch('./entries/**/*.js',['jsConcat']);
    gulp.watch('./page/css/**/*.less',['less']);
    gulp.watch('./page/css/**/*.scss',['sass']);
    gulp.watch('./page/img/*',['copy']);
});

gulp.task('ftp', function () {
    gulp.src('./dist/*')
    .pipe(ftp({
            host: '10.2.8.102',
            port:21,
            user:'product',
            pass:'PrM2015Q',
            remotePath:'/gulp'
     }))
});
gulp.task('default',['copy','less','jsConcat','spring','watch']);
gulp.task('pro',['copy','less','jsConcat','spring']);
