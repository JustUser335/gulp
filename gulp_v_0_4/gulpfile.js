const { src, dest, parallel, series, watch } = require('gulp');
const browserSync = require('browser-sync').create();
const concat      = require('gulp-concat');
const uglify      = require('gulp-uglify-es').default;
const sass        = require('gulp-sass')(require('sass'));
const cssPrefix   = require('gulp-autoprefixer');
const cleanCss    = require('gulp-clean-css');
const imgMin      = require('compress-images');
const del         = require('del');


function browser_sync()
{
    browserSync.init({
        server: { baseDir: 'app/' },
        notify: true,
        online: false
    });
}

function scripts()
{
    return src([
        'node_modules/jquery/dist/jquery.min.js',
        'app/js/app.js'
    ])
    .pipe(concat('app.min.js'))
    .pipe(uglify())
    .pipe(dest('app/js/'))
    .pipe(browserSync.stream());
}

function styles()
{
    return src(['app/sass/main.sass','app/css/app.css'])
        .pipe(sass())
        .pipe(concat('app.min.css'))
        .pipe(cssPrefix({overrideBrowserslist: ['last 10 versions'], greed: true}))
        .pipe(cleanCss({ level: { 1: { specialComments: 0 }}}))
        .pipe(dest('app/css/'))
        .pipe(browserSync.stream())
}

function images()
{
    return Promise.resolve(
        imgMin(
            "app/images/src/**/*",
            "app/images/dest/",
            { compress_force: false, statistic: true, autoupdate: true },
            false,
            { jpg: { engine: "mozjpeg", command: ["-quality", "60"] } },
            { png: { engine: "pngquant", command: ["--quality=20-50", "-o"] } },
            { svg: { engine: "svgo", command: "--multipass" } },
            {
                gif: { engine: "gifsicle", command: ["--colors", "64", "--use-col=web"] },
            },
            function (err, completed) {
                if (completed === true) {
                    browserSync.reload()
                }
            }
        )
    );
}

function updateImages() 
{
    return del(['app/images/dest/**']);
}

function watchAllFile()
{
    watch(['app/**/*.js','!app/**/*.min.js'],scripts);
    watch(['app/sass/main.sass','app/css/app.css'], styles);
    watch(['app/*.html']).on('change', browserSync.reload);
    watch(['app/images/**'], images);
}

function production_v_1_0()
{
    return src(['app/**/*','!app/images/src/**','!app/sass/**'])
        .pipe(dest('dist/'));
}

exports.browser_sync = browser_sync;
exports.scripts      = scripts;
exports.styles       = styles;
exports.images       = images;
exports.updateImages = updateImages;

exports.default      = parallel( scripts, styles, images, browser_sync, watchAllFile );
exports.production   = series( scripts, styles, images, production_v_1_0);
