const imagemin = require('imagemin');
const img_jpg  = require('imagemin-jpegtran')
const img_png  = require('imagemin-pngquant')
const img_webp = require('imagemin-webp')

const gulp = require('gulp');


/*===============================================*/

gulp.task('hello',function () {
    console.log('console otput');
});
gulp.task('log',function () {
    console.log('console otput 1');
});
gulp.task('default1',gulp.parallel('hello','log'));

/*===============================================*/

// gulp.task('build1',function () {
//     return gulp.src(['template/**'],{dot: true,nodir: true}).pipe(gulp.dest('production'));
// })
// gulp.task('build2', function () {
//     return gulp.src('tmp/**').pipe(gulp.dest('production/about'))
// })
// gulp.task('def', gulp.parallel('build1','build2'))

/*\
|*| прям полезные
|*| src
|*| - dot: true добавляет файлы с точкой
|*| - nodir: true игнорирует пустые папки
|*| - read: можноигнорить файлы и собирать структуры
|*| dest
|*| - append обновляет содержимое файла
|*| - sourcemaps плагин
|*|
\*/
/*===============================================*/

// gulp.task('build3',function () {
//     return gulp.src(['template/*.html']).pipe(gulp.symlink('production'));
// })

/*===============================================*/
/*\
|*| Объединение файлов в один чекнуить
|*| сжатие изображений
\*/

gulp.task('build4',function () {
    return gulp.src(['template/*.html'])
        .pipe(imagemin(['images/*.{jpg,png}'], {
            destination: 'build/images',
            plugins: [
                img_jpg(),
                img_png(),
                img_webp({quality: 50})
            ])
        .pipe(gulp.dest('production'));
})

