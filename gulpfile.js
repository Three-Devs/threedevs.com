var gulp= require('gulp');
var sass= require('gulp-sass');

gulp.task('sass', function(){
  return gulp.src('site/scss/styles.scss')
    .pipe(sass()) // Converts Sass to CSS with gulp-sass
    .pipe(gulp.dest('site/css'))
});

gulp.task('watch', function(){
  gulp.watch('site/scss/**/*.scss', ['sass']); 
})

