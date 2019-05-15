var gulp= require('gulp');
var sass= require('gulp-sass');

gulp.task('sass', function(){
  return gulp.src('src/assets/scss/styles.scss')
    .pipe(sass()) // Converts Sass to CSS with gulp-sass
    .pipe(gulp.dest('site/assets/css'))
});

gulp.task('watch', function(){
  gulp.watch('src/assets/scss/**/*.scss', gulp.series('sass')); 
})

