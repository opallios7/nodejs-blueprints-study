var gulp = require('gulp');

// Nodemon은 파일의 변화가 있을때 어플리케이션을 리로드 하는 Node.js 모듈이다.
nodemon = require('gulp-nodemon');
plumber = require('gulp-plumber');

// 라이브리로드는 서버 측 변경을 에플리케이션과 동기화해주는 브라우져 플러그인이다.
livereload = require('gulp-livereload');
gulp.task('develop', function() {
  livereload.listen();
  nodemon({
    script: 'app.js',
    ext: 'js ejs',
    stdout: false
  }).on('readable', function() {
    this.stdout.on('data', function (chunk) {
      if(/^Express server listening on port/.test(chunk))
      {
        livereload.changed(__dirname);
      }
    });
    this.stdout.pipe(process.stdout);
    this.stdout.pipe(process.stderr);
  });
});

// 모든 Gulp 테스크는 이름을 붙일 수 있다.
// 기본 태스크를 호출하기 위해 develop이라는 별칭을 주었다.
// 대규모 어플리케이션은 별칭이 없는 태스크가 많이 있을 수 있다.
gulp.task('default', [
  'develop'
]);