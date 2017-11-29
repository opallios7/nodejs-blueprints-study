// 패스포트 모듈 로드
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
// 사용자 모델 로드
var User = require('../models/User');

passport.serializeUser(function(user, done) {
  // 세션용으로 사용자 직렬화
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  // 사용자 역직렬화
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

// local strategy 사용
passport.use(new LocalStrategy({ usernameField: 'email' }, function(email, password, done) {
  User.findOne({ email: email }, function(err, user) {
    if (!user) {
      // 사용자가 없을 경우 오류 처리
      return done(null, false, { msg: 'The email: ' + email + ' is already taken. '});
    }
    user.comparePassword(password, function(err, isMatch) {
      if (!isMatch) {
        // 비밀번호가 틀린 경우 오류처리
        return done(null, false, { msg: 'Invalid email or password' });
      }
      return done(null, user);
    });
  });
}));
