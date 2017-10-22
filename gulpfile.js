"use strict";

var gulp = require("gulp");
var less = require("gulp-less");
var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var minify = require("gulp-csso");
var uglify = require("gulp-uglify");
var rename = require("gulp-rename");
var imagemin = require("gulp-imagemin");
var webp = require("gulp-webp");
var svgstore = require("gulp-svgstore");
var posthtml = require("gulp-posthtml");
var include = require("posthtml-include");
var server = require("browser-sync").create();
var run = require("run-sequence");
var del = require("del");

// CSS

gulp.task("style", function() {
  gulp.src("less/style.less")
    .pipe(plumber())
    .pipe(less())
    .pipe(postcss([
      autoprefixer(),
      require("postcss-object-fit-images")
    ]))
    .pipe(minify())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("build/css"))
    .pipe(server.stream())
});

// IMAGES

gulp.task("images", function () {
  return gulp.src("build/img/**/*.{png,jpg,svg}")
  .pipe(imagemin([
    imagemin.optipng({optimizationLevel: 3}),
    imagemin.jpegtran({progressive: true}),
    imagemin.svgo()
 ]))
 .pipe(gulp.dest("build/img"))
});

// WEBP

gulp.task("webp", function () {
  return gulp.src("img/**/*.{png,jpg}")
  .pipe(webp({quality: 90}))
  .pipe(gulp.dest("build/img"))
});

// SVG SPRITE

gulp.task("sprite", function () {
  return gulp.src("img/*.svg")
  .pipe(svgstore({
    inlineSvg: true
  }))
  .pipe(rename("sprite.svg"))
  .pipe(gulp.dest("build/img"))
});

// JS

gulp.task("js", function() {
  return gulp.src(["js/*.js", "!js/*.min.js"])
    .pipe(uglify())
    .pipe(rename({
      suffix: ".min"
    }))
    .pipe(gulp.dest("build/js"))
});

// HTML

gulp.task("html", function () {
  return gulp.src("*.html")
  .pipe(posthtml([
    include()
  ]))
  .pipe(server.stream())
  .pipe(gulp.dest("build"))
});

// CLEAN BUILD

gulp.task("clean", function () {
  return del("build");
});

// COPY

gulp.task("copy", function () {
  return gulp.src([
    "fonts/**/*.{woff,woff2}",
    "img/**",
    "js/**"
    ], {
      base: "."
    })
  .pipe(gulp.dest("build"))
});

// BUILD

gulp.task("build", function (done) {
  run(
    "clean",
    "copy",
    "style",
    "js",
    "images",
    "webp",
    "sprite",
    "html",
    done
  )
});


// LIVE SERVER

gulp.task("serve", function() {
  server.init({
    server: "build/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("less/**/*.less", ["style"]).on("change", server.reload);
  gulp.watch("*.html", ["html"]).on("change", server.reload);
  gulp.watch("js/*.js", ["js"]).on("change", server.reload);
});
