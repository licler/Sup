//Задает константы ///////////////////////////////////////////////////////////////////////////////////////////////////////
// const { src, dest, watch, series, parallel } = require('gulp');
// const scss = require('gulp-sass');
// const scss = require('gulp-sass')(require('sass'));
// const autoprefixer = require('gulp-autoprefixer');
// const concat = require('gulp-concat');
// const browsersync = require('browser-sync').create();
// const group_media = require('gulp-group-css-media-queries');
// const fileInclude = require('gulp-file-include');
// const uglify = require('gulp-uglify-es').default;
// const del = require('del');
// const ttf2woff = require('gulp-ttf2woff');
// const ttf2woff2 = require('gulp-ttf2woff2');
// const imagemin = require("gulp-imagemin");
// const webp = require('gulp-webp');
// const webphtml = require('gulp-webp-html');
// const webpcss = require('gulp-webpcss');
// const fonter = require('gulp-fonter');
// const clean_css = require("gulp-clean-css");
// const rename = require("gulp-rename");
// const svgSprite = require("gulp-svg-sprite");

let project_folder="dist";
let source_folder="app";

let fs = require('fs');

let path={
    build:{
        html: project_folder + "/",
        css: project_folder + "/css/",
        js: project_folder + "/js/",
        img: project_folder + "/img/",
        fonts: project_folder + "/fonts/",
        video: project_folder + "/video",
    },
    src:{
        html: [source_folder + "/*.html", "!" + source_folder + "/_*.html"],
        css: source_folder + "/scss/style.scss",
        js: source_folder + "/js/main.js",
        img: source_folder + "/img/**/*.{jpg,png,svg,gif,ico,webp}",
        fonts: source_folder + "/fonts/*.ttf",
        video: source_folder + "/video/*.{ogg,ogv,webm,mp4}",
     
    },
    watch:{
        html: source_folder +"/**/*.html",
        css: source_folder + "/scss/**/*.scss",
        js: source_folder + "/js/**/*.js",
        img: source_folder + "/img/**/*.{jpg,png,svg,gif,ico,webp}",
        video: source_folder + "/video/*.{ogg,ogv,webm,mp4}",
      
    }, 
    clean:"./" + project_folder + "/"
}

let { src, dest } = require('gulp'),
    gulp = require('gulp'),
	scss = require('gulp-sass')(require('sass'));
	autoprefixer = require('gulp-autoprefixer');
	concat = require('gulp-concat');
	browsersync = require('browser-sync').create();
	group_media = require('gulp-group-css-media-queries');
	fileInclude = require('gulp-file-include');
	uglify = require('gulp-uglify-es').default;
	del = require('del');
	ttf2woff = require('gulp-ttf2woff');
	ttf2woff2 = require('gulp-ttf2woff2');
	imagemin = require("gulp-imagemin");
	webp = require('gulp-webp');
	webphtml = require('gulp-webp-html');
	webpcss = require('gulp-webpcss');
	fonter = require('gulp-fonter');
	clean_css = require("gulp-clean-css");
	rename = require("gulp-rename");
	svgSprite = require("gulp-svg-sprite");


function browserSync(params) {
    browsersync.init({
       server:{
           baseDir: "./" + project_folder + "/"
       },
       port: 3000,
       notify: false

    })

}   

function html() {
    return src(path.src.html)
    .pipe(fileInclude())
    .pipe(webphtml())
    .pipe(dest(path.build.html))
    .pipe(browsersync.stream())
}

function css() {
    // return src(path.src.css)
    return gulp.src([
        'node_modules/normalize.css/normalize.css',
        'node_modules/slick-carousel/slick/slick.css',
        'node_modules/magnific-popup/dist/magnific-popup.css',
        'node_modules/animate.css/animate.css',
        'app/scss/style.scss'
      ])  
      .pipe(scss({outputStyle: 'compressed'}))
      .pipe(concat('style.min.css'))
      .pipe(autoprefixer({
          overrideBrowserslist: ['last 10 version'],
          cascade: true
      }))
    .pipe(webpcss())
    .pipe(dest(path.build.css))
    .pipe(clean_css())
    // .pipe(
    //     rename({
    //         extname: ".min.css"
    //     })
    // )
      .pipe(dest(path.build.css))
      .pipe(browsersync.stream())
}
//     .pipe(
//         scss({
//             outputStyle: "expanded"
//         })
//     )
//     .pipe(
//         group_media()
//     )
//  

function js() {
    // return src(path.src.js)
    gulp.src([
        'node_modules/jquery/dist/jquery.js',
        'node_modules/slick-carousel/slick/slick.js',
        'node_modules/magnific-popup/dist/jquery.magnific-popup.js',
        'node_modules/wow.js/dist/wow.js',
        'app/js/main.js'  
    
    ])
    .pipe(concat('main.min.js'))
            .pipe(uglify())
            .pipe(dest(path.build.js))
            .pipe(browsersync.stream())
    }
    
    

//     .pipe(fileinclude())
  
//     .pipe(dest(path.build.js))
    
//     .pipe(
//         uglify()
//     )
    
//     .pipe(
//         rename({
//             extname: ".min.js"
//         })
//     )
//     .pipe(dest(path.build.js))
//     .pipe(browsersync.stream())
// }
function video() {
    return src(path.src.video)
    .pipe(dest(path.build.video))
    .pipe(browsersync.stream())
}



function images() {
    return src(path.src.img)
    .pipe(
        webp({
           quality: 70
        })
    )
    .pipe(dest(path.build.img))
    .pipe(src(path.src.img))
    .pipe(
        imagemin({
            progressive: true,
            svgoPlugins: [{ removeViewBox: false }],
            interpased: true,
            optimizationLevel: 3
        })
    )
    .pipe(dest(path.build.img))
    .pipe(browsersync.stream())
}

function fonts(params) {
    src(path.src.fonts)
    .pipe(ttf2woff())
    .pipe(dest(path.build.fonts));
    return src(path.src.fonts)
    .pipe(ttf2woff2())
    .pipe(dest(path.build.fonts));
}


gulp.task('otf2ttf', function () {
    return src([source_folder + '/fonts/*.otf'])
    .pipe(fonter({
        formats: ['ttf']
    }))
    .pipe(dest(source_folder + '/fonts/'));
})



gulp.task('svgSprite', function () {
     return gulp.src([source_folder + '/iconsprite/*.svg'])
     .pipe(svgSprite({
         mode: {
             stack: {
                 sprite: "../icons/icons.svg",
                 example: true
             }
         },
        }
     ))
     .pipe(dest(path.build.img))
})



    
function fontsStyle(params) {

    let file_content = fs.readFileSync(source_folder + '/scss/fonts.scss');
    if (file_content == '') {
     fs.writeFile(source_folder + '/scss/fonts.scss', '', cb);
     return fs.readdir(path.build.fonts, function (err, items) {
       if (items) {
         let c_fontname;
         for (var i = 0; i < items.length; i++) {
          let fontname = items[i].split('.');
          fontname = fontname[0];
          if (c_fontname != fontname) {
            fs.appendFile(source_folder + '/scss/fonts.scss', '@include font("' + fontname + '", "' + fontname + '", "400", "normal");\r\n', cb);
          }
          c_fontname = fontname;
         }
        }
       })
      }
    }

function cb() {

}


function watchFiles(params) {
    gulp.watch([path.watch.html], html);
    gulp.watch([path.watch.css], css);
    gulp.watch([path.watch.js], js);
    gulp.watch([path.watch.img], images);
    gulp.watch([path.watch.video], video);
}


function clean(params) {
    return del(path.clean);
}

let build = gulp.series(clean, gulp.parallel(js, css, html, fonts, images, video), fontsStyle);
let watch = gulp.parallel(build, watchFiles, browserSync);


exports.video = video;
exports.fontsStyle = fontsStyle;
exports.fonts = fonts;
exports.images = images;
exports.js = js;
exports.css = css;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;