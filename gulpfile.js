"use strict";
const {
  task,
  src,
  dest,
  watch,
  parallel,
  series
} = require("gulp");
const scss = require("gulp-sass")(require("sass"));
const concat = require("gulp-concat");
const autoprefixer = require("gulp-autoprefixer");
const tiny = require("gulp-tinypng-compress");
const uglify = require("gulp-uglify");
const del = require("del");
const browserSync = require("browser-sync").create();
const svgo = require("gulp-svgo");
const svgSprite = require("gulp-svg-sprite");
const fileInclude = require("gulp-file-include");

const htmlInclude = () => {
  return src(["app/html/*.html"]) // Находит любой .html файл в папке "html", куда будем подключать другие .html файлы
    .pipe(
      fileInclude({
        prefix: "@",
        basepath: "@file",
      })
    )
    .pipe(dest("app")) // указываем, в какую папку поместить готовый файл html
    .pipe(browserSync.stream());
};

function scripts() {
  return src([
      "node_modules/swiper/swiper-bundle.js",
      "app/js/main.js",
    ])
    .pipe(concat("main.min.js"))
    .pipe(uglify())
    .pipe(dest("app/js"))
    .pipe(browserSync.stream());
}

function svg() {
  return src("app/images/icons/**/*.svg")
    .pipe(
      svgo({
        plugins: [{
          removeAttrs: {
            attrs: "(fill|srtoke|data.*)",
          },
        }, ],
      })
    )
    .pipe(
      svgSprite({
        mode: {
          stack: {
            sprite: "../sprite.svg",
          },
        },
      })
    )
    .pipe(dest("app/images"));
}

const tinypng = () => {
  return src("app/images/**.jpg", "app/images/**.png", "app/images/**.jpeg")
    .pipe(
      tiny({
        key: "QCBQTn16gkKtqRmft1SGpNcjw9pjp2q2",
        log: true,
      })
    )
    .pipe(dest("app/images"));
};

function browsersync() {
  browserSync.init({
    server: {
      baseDir: "app/",
    },
    notify: false,
  });
}

const imgToApp = () => {
  return src([
    "app/images/**/*.png",
    "app/images/**/*.jpg",
    "app/images/**/*.jpeg",
  ]).pipe(dest("app/images"));
};

function styles() {
  return src("app/scss/style.scss")
    .pipe(
      scss({
        outputStyle: "compressed",
      })
    )
    .pipe(concat("style.css"))
    .pipe(
      autoprefixer({
        overrideBrowserslist: ["last 10 versions"],
        grid: true,
      })
    )
    .pipe(dest("app/css"))
    .pipe(browserSync.stream());
}

function build() {
  return src(
    [
      "app/**/*.html",
      "app/css/style.css",
      "app/fonts/**/*",
      "app/images/**/*",
      "app/js/main.min.js",
    ], {
      base: "app",
    }
  ).pipe(dest("dist"));
}

function cleanDist() {
  return del("dist");
}

function watching() {
  watch(["app/html/**/*.html"], htmlInclude);
  watch(["app/images/icons/**/*.svg"], svg);
  watch(["app/scss/**/*.scss"], styles);
  watch(["app/js/**/*.js", "!app/js/main.min.js"], scripts);
  watch(["app/**/*.html"]).on("change", browserSync.reload);
}

exports.htmlInclude = htmlInclude;
exports.styles = styles;
exports.scripts = scripts;
exports.browsersync = browsersync;
exports.watching = watching;
exports.cleanDist = cleanDist;
exports.svg = svg;
exports.build = series(cleanDist, tinypng, build);

exports.default = parallel(
  htmlInclude,
  styles,
  svg,
  scripts,
  browsersync,
  imgToApp,
  watching
);
