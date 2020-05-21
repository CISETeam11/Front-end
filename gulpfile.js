const gulp = require("gulp");
const babel = require("gulp-babel");
const uglify = require("gulp-uglify");
const csso = require("gulp-csso");
const htmlmin = require("gulp-htmlmin");

/*gulp.task("js-minify", function() {
  return gulp.src("./js/*.js")
    .pipe(babel({
      presets: ["env"]
    }))
    .pipe(uglify())
    .pipe(gulp.dest("./dist/js"));
});*/

gulp.task("css-minify", function() {
  return gulp.src("./css/*.css")
    .pipe(csso())
    .pipe(gulp.dest("./dist/css"));
});

gulp.task("html-minify", function() {
  return gulp.src("./*.html")
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeComments: true
    }))
    .pipe(gulp.dest("./dist"));
});

gulp.task("default", function(done) {
  var runTasks = gulp.series(/*"js-minify",*/ "css-minify", "html-minify");
  runTasks();
  done();
});