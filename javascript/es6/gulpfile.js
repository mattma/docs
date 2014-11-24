var gulp = require('gulp'),
  to5 = require('gulp-6to5');

// @describe compile es6 modules into amd modules
gulp.task('compile', function () {
  return gulp.src('es6-*.js')
    .pipe(to5())
    .pipe(gulp.dest('compiled/'));
});

gulp.task('watch', function(){
  gulp.watch('./es6-*.js', ['compile']);
});

gulp.task('default', [ 'watch' ]);
