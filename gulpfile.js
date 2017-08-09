/**
 * Created by Administrator on 2017/8/7 0007.
 */
var gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    cleancss = require('gulp-clean-css'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    del = require('delete'),
    flatten=require('gulp-flatten'),
    plumber=require('gulp-plumber'),
    babel=require('gulp-babel'),
    nodemon= require('gulp-nodemon')
runSequence = require('run-sequence');
/*let gulpLoadPlugins = require('gulp-load-plugins');
let plugins = gulpLoadPlugins();*/

var browserSync = require('browser-sync').create();
var reload = browserSync.reload;


var src = {
        common_css: [
            'public/stylesheets/common/*.css'
        ],
        main_css: [
            'public/stylesheets/private/*.css'
        ],
        common_js: [
            'public/javascripts/common/*.js'
        ],
        main_js: [
            'public/javascripts/private/*.js'
        ]
    },
    dist = {
        root: './static/',
        html: './static/templates/',
        css: './static/css/',
        js: './static/js/'
    };




gulp.task('clean', function () {
    return del.sync([dist.root]);
});
// Components CSS
var autoprefixer_option = [
    "Android 2.3",
    "Android >= 4",
    "Chrome >= 20",
    "Firefox >= 24",
    "Explorer >= 8",
    "iOS >= 6",
    "Opera >= 12",
    "Safari >= 6"
];
gulp.task('common_css', function () {
    return gulp.src(src.common_css)
        .pipe(plumber({  // 编译出错时控制台打印错误，pipe 流不挂起
            errorHandler: function(error) {
                console.log(error.message);
                // 参考 http://frontendgods.com/handling-errors-when-working-with-sass-watch-plumber-and-gulp/
                this.emit("end");  // 多了这一句
            }
        }))
        .pipe(autoprefixer(autoprefixer_option))
        .pipe(concat('vendor.css'))
        .pipe(cleancss({compatibility: 'ie8'}))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(dist.css))
});
/*自己写的css*/
gulp.task('private_css', function () {
    return gulp.src(src.main_css)
        .pipe(plumber({  // 编译出错时控制台打印错误，pipe 流不挂起
            errorHandler: function(error) {
                console.log(error.message);
                // 参考 http://frontendgods.com/handling-errors-when-working-with-sass-watch-plumber-and-gulp/
                this.emit("end");  // 多了这一句
            }
        }))
        .pipe(autoprefixer(autoprefixer_option))
        .pipe(concat('main.css'))
        .pipe(cleancss({compatibility: 'ie8'}))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(dist.css))
});
// Components JS
gulp.task('common_js', function () {
    return gulp.src(src.common_js)
        .pipe(plumber({  // 编译出错时控制台打印错误，pipe 流不挂起
            errorHandler: function(error) {
                console.log(error.message);
                // 参考 http://frontendgods.com/handling-errors-when-working-with-sass-watch-plumber-and-gulp/
                this.emit("end");  // 多了这一句
            }
        }))
        .pipe(concat('vendor.js'))
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(dist.js))
});
/*自己写的js*/
gulp.task('private_js', function () {
    return gulp.src(src.main_js)
        .pipe(plumber({  // 编译出错时控制台打印错误，pipe 流不挂起
            errorHandler: function(error) {
                console.log(error.message);
                // 参考 http://frontendgods.com/handling-errors-when-working-with-sass-watch-plumber-and-gulp/
                this.emit("end");  // 多了这一句
            }
        }))
        .pipe(concat('main.js'))
        .pipe(babel({presets: ['es2015']}))
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(dist.js))
});

// 服务器
// nodemon 的配置
// 一些文件的路径
var paths = {
    client: [
        './public/javascripts/*.js',
        './public/stylesheets/*.css'
    ],
    server: {
        index: 'bin/www'
    }
};
var nodemonConfig = {
    script : paths.server.index,
    ignore : ["gulpfile.js", "node_modules/"],
    watch:[paths.server.index,'./app.js','./routes/*.js'],
    env    : {
        "NODE_ENV": "development"
    }
};
//重启服务器
gulp.task("nodeserve",function () {
    var started = false;
    return nodemon(nodemonConfig).on('start', function() {
        if (!started) {
            cb();
            started = true;
        }
    });
});
//打开浏览器
gulp.task('open', ['nodeserve'], function(){
    //使用node搭建了本地服务器所以broswer_sync不需要搭建静态服务器可是直接使用代理
    browserSync.init({
        proxy: 'http://localhost:3000',
        files: ["public/**/*.*", "views/**", "routes/**"],
        browser: 'chrome',
        port:8080,
        open:true,
    }, function() {
        console.log("browser refreshed.");
    });
});

//Watch对js和css进行压缩
gulp.task('watch', function () {
    gulp.watch(src.common_css, ['common_css']);
    gulp.watch(src.main_css, ['private_css']);
    gulp.watch(src.common_js, ['common_js']);
    gulp.watch(src.main_js, ['private_js']);
});

// Reload
//刷新浏览器
var files=[
    './static/**/*',
    './views/*.html',
    './routes/*.html'
];
gulp.task('reload',function () {
    gulp.watch(files).on('change',browserSync.reload);
});



gulp.task('default', function () {
    return runSequence(
        'clean',
        ['common_css','common_js', 'private_css','private_js'],
        'open',
        'watch',
        'reload',
        function () {
            console.log("成功");
        }
    );
});