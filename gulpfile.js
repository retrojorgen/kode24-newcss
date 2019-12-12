const gulp = require("gulp");
const sass = require("gulp-sass");
const del = require("del");
const concat = require("gulp-concat");

gulp.task("styles", () => {
  return gulp
    .src("./scss/*.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(gulp.dest("./css/"));
});

gulp.task("pack-lab-js", function() {
  return gulp
    .src(["src/lab/*.js"])
    .pipe(concat("lab.js"))
    .pipe(gulp.dest("scripts/"));
});

gulp.task("pack-kode24-js", function() {
  return gulp
    .src(["src/kode24/*.js"])
    .pipe(concat("kode24.js"))
    .pipe(gulp.dest("scripts/"));
});

gulp.task("clean", () => {
  return del(["css/*", "scripts/*"]);
});

gulp.task(
  "default",
  gulp.series(["clean", "styles", "pack-lab-js", "pack-kode24-js"])
);

gulp.task("watch", () => {
  gulp.watch(["scss/*.scss", "src/**"], done => {
    gulp.series(["clean", "styles", "pack-lab-js", "pack-kode24-js"])(done);
  });
});
