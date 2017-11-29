// 모듈 불러오기
var express = require('express');
var path = require('path');
var logger = require('morgan');
var compression = require('compression');
var methodOverride = require('method-override');
var session = require('express-session');
var flash = require('express-flash');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var dotenv = require('dotenv');
var mongoose = require('mongoose');
var passport = require('passport');
var swig = require('swig');

// 환경 변수 가져오기
dotenv.load();

// 어플리케이션 컨트롤러 불러오기
var home = require('./controller/home');
var user = require('./controller/user');

// 패스포트 local strategy 사용
require('./config/passport');

var app = express();

// 데이터베이스 설정
mongoose.connect(process.env.MONGODB);
mongoose.connection.on('error', function() {
  console.log('MongoDB Connection Error. Please make sure that MongoDB is running.');
  process.exit(1);
});

// 뷰 엔진 설정
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views/pages'));

app.set('port', process.env.PORT || 3000);
app.use(compression());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(methodOverride('_method'));
app.use(session({ secret: process.env.SESSION_SECRET, resave: true, saveUninitialized: true}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
  res.locals.user = req.user;
  next();
});

// 공용 디렉토리 설정
app.use(express.static(path.join(__dirname, 'public')));

// 어플리케이션 라우트 및 컨트롤러
app.get('/', home.index);
app.get('/account', user.ensureAuthenticated, user.accountGet);
app.put('/account', user.ensureAuthenticated, user.accountPut);
app.delete('/account', user.ensureAuthenticated, user.accountDelete);
app.get('/signup', user.signupGet);
app.post('/signup', user.signupPost);
app.get('/login', user.loginGet);
app.post('/login', user.loginPost);
app.get('/logout', user.logout);

// 실무 환경시 에러 헨들러
if(app.get('env') === 'production') {
  app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.sendStatus(err.status || 500);
  });
}

app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});

module.exports = app;