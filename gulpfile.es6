var gulp = require('gulp'),
    rename = require('gulp-rename'),
    del = require('del'),
    mocha = require('gulp-mocha'),
    concat = require("gulp-concat"),
    babel = require("gulp-babel"),
    order = require("gulp-order"),
    sass = require("gulp-sass"),
    shell = require('gulp-shell'),
    autoprefixer = require('gulp-autoprefixer');

gulp.task("default", () => gulp.start([
    'copy-public',
    'gen-html',
    'gen-js',
    'gen-css',
    'gen-lib-js',
    'gen-lib-css'
]));

gulp.task('dev', ['start-server', 'default'], () => {
    gulp.watch([
        'src/**/*'
    ], ['default']);
});

gulp.task('start-server', shell.task(['sh start-server.sh']));

gulp.task('copy-public', () =>
    gulp.src(['src/public/**/*'])
        .pipe(gulp.dest("release/public"))
);

gulp.task("gen-html", () =>
    gulp.src([
            "src/components/head/head.html",
            "src/components/**/!(footer)*.html",
            "src/components/footer/footer.html"
        ])
        .pipe(concat("index.ejs"))
        .pipe(gulp.dest('server/views'))
        //.pipe(concat("index.html"))
        //.pipe(gulp.dest('release'))
);

gulp.task('gen-js', () =>
    gulp.src(['src/app.es6', 'src/components/**/*.es6'])
        .pipe(concat('app.js'))
        .pipe(babel())
        .pipe(gulp.dest("release/public"))
);

gulp.task('gen-css', () =>
    gulp.src([
            'src/components/global/global.scss',
            "src/components/**/*.scss"
        ])
        .pipe(concat('app.scss'))
        .pipe(sass({errLogToConsole: true}))
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(gulp.dest("release/public"))
);

gulp.task('gen-lib-js', () =>
    gulp.src([
            'src/bower-components/jquery/dist/jquery.min.js',
            'src/bower-components/angular/angular.min.js',
            'src/bower-components/angular-ui-router/release/angular-ui-router.min.js',
            'src/bower-components/lodash/lodash.min.js',
            'src/bower-components/moment/moment.js',
            'src/bower-components/fastclick/lib/fastclick.js',
            'src/bower-components/jquery-ui/jquery-ui.min.js'
        ])
        .pipe(concat('lib.js'))
        .pipe(gulp.dest("release/public"))
);

gulp.task('gen-lib-css', () =>
    gulp.src(['src/bower-components/bootstrap/dist/css/bootstrap.min.css'])
        .pipe(concat('lib.css'))
        .pipe(gulp.dest("release/public"))
);