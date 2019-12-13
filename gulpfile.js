const gulp = require("gulp");
const sass = require("gulp-sass");
const del = require("del");
const concat = require("gulp-concat");
const uglify = require("gulp-uglify-es").default;
gulp.task("dev-compile-styles", () => {
  return gulp
    .src("./scss/*.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(gulp.dest("dist"));
});

gulp.task("prod-compile-styles", () => {
  return gulp
    .src("./scss/*.scss")
    .pipe(sass({ outputStyle: "compressed" }).on("error", sass.logError))
    .pipe(gulp.dest("dist"));
});

gulp.task("dev-pack-scripts-js", function() {
  return gulp
    .src(["src/**/*.js"])
    .pipe(concat("scripts.js"))
    .pipe(gulp.dest("dist"));
});

gulp.task("prod-pack-scripts-js", function() {
  return gulp
    .src(["src/**/*.js"])
    .pipe(concat("scripts.js"))
    .pipe(uglify())
    .pipe(gulp.dest("dist"));
});

gulp.task("clean", () => {
  return del(["css/*", "scripts/*"]);
});

gulp.task(
  "default",
  gulp.series(["clean", "dev-pack-scripts-js", "dev-compile-styles"])
);

gulp.task(
  "prod",
  gulp.series(["clean", "prod-pack-scripts-js", "prod-compile-styles"])
);

gulp.task("watch", () => {
  gulp.watch(["scss/*.scss", "src/**"], done => {
    gulp.series(["clean", "styles", "dev-pack-scripts-js"])(done);
  });
});
