var gulp=require('gulp'),
    less=require('gulp-less'),
    concat=require('gulp-concat'),
    sass=require('gulp-sass'),
    watch=require('gulp-watch'),
    clean=require('gulp-clean'),
    replace=require('gulp-replace'),
    cssmin=require('gulp-minify-css'),
    js=require('gulp-requirejs-optimize'),
    autoprefix=require('gulp-autoprefixer'),
    spriter = require('gulp-css-spriter'),
    ftp = require('gulp-ftp');
    //gulpSequence = require('gulp-sequence');

var webpack=require('webpack'),
    fs=require('fs');

var config=JSON.parse(fs.readFileSync('./config.json',{encoding:"UTF-8"}));

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
gulp.task('lib', function () {
    gulp.src('./entries/lib/**/*.*')
        .pipe(gulp.dest('./dist/lib/'))
});
gulp.task('menuConfig', function () {
    gulp.src('./page/jsonConfig/*.*')
        .pipe(gulp.dest('./dist/jsonConfig/'))
});
gulp.task('clear', function () {
    gulp.src('./dist',{read:false})
    .pipe(clean())
});

gulp.task('ftp', function () {
    gulp.src('./dist/*')
    .pipe(ftp({
            host: '10.2.8.115',
            port:21,
            user:'root',
            pass:'111111',
            remotePath:'/var/static/poss/test'
     }))
});
gulp.task('clear:js', function () {
    return gulp.src('./dist/js',{read:false})
        .pipe(clean());
});
gulp.task('jsConcat', function () {
    return gulp.src('./entries/action/*.js')
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
                    "template":"empty:",
                    "fueluxLoader":"empty:",
                    "model":"empty:",
                    "bootstrapSwitch":"empty:",
                    "parsley": "empty:",
                    "gritter": "empty:",
                    "icheck": "empty:"
                },
                baseUrl: './',
                include: 'entries/main',
                exclude:['text']
            };
        }))
        .pipe(gulp.dest('./dist/js'))
});

gulp.task("replace:testHtml", function () {
    gulp.src('./dist/bootstrap/*.html')
        .pipe(replace(/\.\.\/\.\.\/(dist|entries)/g,config.testUrl.html))
        .pipe(gulp.dest('./dist/bootstrap/'))
});
gulp.task("replace:uatHtml", function () {
    gulp.src('./dist/bootstrap/*.html')
        .pipe(replace(/\.\.\/\.\.\/(dist|entries)/g,config.uatUrl.html))
        .pipe(gulp.dest('./dist/bootstrap/'))
});
gulp.task("replace:proHtml", function () {
    gulp.src('./dist/bootstrap/*.html')
        .pipe(replace(/\.\.\/\.\.\/(dist|entries)/g,config.proUrl.html))
        .pipe(gulp.dest('./dist/bootstrap/'))
});

gulp.task("replace:test",['jsConcat'], function () {
    gulp.src('./dist/js/*.js')
        .pipe(replace("%baseUrl%",config.testUrl.base))
        .pipe(replace("%loginUrl%",config.testUrl.log))
        .pipe(gulp.dest('./dist/js/'))
});
gulp.task("replace:uat",['jsConcat'], function () {
    gulp.src('./dist/js/*.js')
        .pipe(replace("%baseUrl%",config.uatUrl.base))
        .pipe(replace('%loginUrl%',config.uatUrl.log))
        .pipe(gulp.dest('./dist/js/'))
});
gulp.task("replace:pro",['jsConcat'], function () {
    gulp.src('./dist/js/*.js')
        .pipe(replace('%baseUrl%',config.proUrl.base))
        .pipe(replace('%loginUrl%',config.proUrl.log))
        .pipe(gulp.dest('./dist/js/'))
});


gulp.task("main:test",['jsConcat'], function () {
    return gulp.src('./entries/main.js')
            .pipe(replace("%baseUrl%",config.testUrl.base))
            .pipe(replace("%loginUrl%",config.testUrl.log))
        .pipe(gulp.dest('./entries/'));
});
gulp.task("main:uat", function () {
    return gulp.src('./entries/main.js')
        .pipe(replace("%baseUrl%",config.uatUrl.base))
        .pipe(replace('%loginUrl%',config.uatUrl.log))
        .pipe(gulp.dest('./entries/'));
});
gulp.task("main:pro", function () {
    return gulp.src('./entries/main.js')
        .pipe(replace('%baseUrl%',config.proUrl.base))
        .pipe(replace('%loginUrl%',config.proUrl.log))
        .pipe(gulp.dest('./entries/'))
});
gulp.task('watch', function () {
    gulp.watch('./entries/**/*.js',['jsConcat']);
    //gulp.watch('./page/css/**/*.less',['less']);
    //gulp.watch('./page/css/**/*.scss',['sass']);
});

/*gulp.task("xun", function (cb) {
    gulpSequence(['copy','less','lib','menuConfig'],'jsConcat','replace:test','watch',cb)
});*/

gulp.task('default',['jsConcat','copy','less','lib','menuConfig','spring','watch','replace:test']);
gulp.task('pro',['copy','less','jsConcat','lib','menuConfig','spring']);
gulp.task("replaceTest",["replace:test","replace:testHtml"]);
gulp.task("replaceUat",["replace:uat","replace:uatHtml"]);
gulp.task("replacePro",["replace:pro","replace:proHtml"]);

