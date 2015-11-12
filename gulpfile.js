var gulp  = require("gulp");
var gutil = require("gulp-util");
var sass  = require("gulp-sass");
var jade  = require("gulp-jade");
var dockerTasks = require("gulp-docker-tasks");

var docker = new dockerTasks({
	workDir: __dirname,
});

docker.attach(gulp);

gulp.task("copy:css", function () {
	return gulp.src([
			"bower_components/normalize-css/*.+(css|map)",
			"bower_components/flexboxgrid/dist/*.+(css|map)",
			"bower_components/font-awesome/css/*.+(css|map)",
		])
		.pipe(gulp.dest("dist/style"));
});

gulp.task("copy:images", function () {
	return gulp.src("src/**/*.+(jpg|jpeg|png|svg)")
		.pipe(gulp.dest("dist"));
});

gulp.task("copy:html", function () {
	return gulp.src("src/**/*.html")
		.pipe(gulp.dest("dist"));
});

gulp.task("copy:font", function () {
	return gulp.src([
		"bower_components/font-awesome/fonts/**/*.+(otf|eot|svg|ttf|woff|woff2)",
		])
		.pipe(gulp.dest("dist/fonts"))
});

gulp.task("copy", ["copy:css", "copy:images", "copy:html", "copy:font"]);

gulp.task("sass", function () {
	return gulp.src("src/**/*.scss")
		.pipe(sass().on("error", sass.logError))
		.pipe(gulp.dest("dist"));
});

gulp.task("jade", function (done) {
	return gulp.src("src/**/*.jade")
		.pipe(jade({
			pretty: true,
		}).on("error", function (err) {
			gutil.log(err.message);
			done();
		}))
		.pipe(gulp.dest("dist"));
});



gulp.task("build-source", ["copy", "sass", "html", "jade"]);

gulp.task("watch", ["copy", "sass", "html", "jade"], function () {
	gulp.watch("src/**/*.scss", ["sass"]);
	gulp.watch("src/**/*.jade", ["jade"]);
	gulp.watch("src/**/*.html", ["copy:html"]);
	gulp.watch("src/**/*.+(jpg,jpeg,png,svg)", ["copy:images"]);
});
