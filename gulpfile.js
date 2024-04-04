const {src, dest, watch, parallel, series} = require('gulp');
const sass = require('gulp-sass') 
(require('dart-sass')); 
const imagemin = require('gulp-imagemin');
const notify = require('gulp-notify');
const webp = require('gulp-webp');
const concat = require('gulp-concat');


//Utilidades Css
const autoprefixer = require('autoprefixer');
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const sourcemap = require('gulp-sourcemaps');

const paths = {
    imagenes : 'src/img/**/*',
    scss : 'src/scss/**/*.scss',
    js: 'src/js/**/*.js'
}


function compilarSass(){
    return src(paths.scss)
    //.pipe(sourcemap.init())
    .pipe( sass({}) )
    //.pipe(postcss([autoprefixer(), cssnano() ]))
    //.pipe(sourcemap.write('.'))
    .pipe( dest('./build/css') );
}

function javascript(){
    return src(paths.js)
    .pipe(concat('bundle.js'))
    .pipe(dest('build/js'))
}

function minificarImagenes(){
    return src(paths.imagenes)
    .pipe( imagemin() )
    .pipe( dest('build/img') );
//    .pipe(notify({mesagge:'Imagen minificada'}))

}

function imagenWebp(){
    return src(paths.imagenes)
    .pipe( webp() )
    .pipe(dest('build/img-webp'));
    //pipe(notify({message: 'Imagen convertida a .webp'}))
}

function revisandoCambios(){
    watch(paths.scss, compilarSass);
    watch(paths.js, javascript);
}

exports.compilarSass = compilarSass;
exports.revisandoCambios = revisandoCambios;
exports.minificarImagenes = minificarImagenes;
exports.imagenWebp = imagenWebp;
exports.default = series(compilarSass, javascript, revisandoCambios)