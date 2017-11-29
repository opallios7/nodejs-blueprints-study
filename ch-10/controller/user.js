// 모듈 가져오기
var async = require('async');
var crypto = require('crypto');
var passport = require('passport');
var User = require('../models/User');

// 인증 미들웨어
exports.ensureAuthenticated = function(req, res, next) {
  if(req.isAuthenticated()) {
    next();
  } else {
    res.redirect('./login');
  }
};

// 로그 아웃
exports.logout = function(req, res) {
  req.logout();
  req.redirect('/');
}

// 로그인 GET
exports.loginGet = function(req, res) {
  if(req.user) {
    return res.redirect('/');
  }
  res.render('login', {
    title: 'Log in'
  });
};

// 로그인 POST
exports.loginPost = function(req, res, next) {
  // 로그인 폼 필드 유효성 검사
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('email', 'Empty email not allowed').notEmpty();
  req.assert('password', 'Empty password not allowed').notEmpty();
  req.sanitize('email').normalizeEmail({ remove_dots: false});
  var errors = req.validationErrors();
  if(errors) {
    // 폼 유효성 검사에 대한 에러 메시지 표시
    req.flash('error', errors);
    return res.redirect('/login');
  }

  passport.authenticate('local', function(err, user, info) {
    if(!user) {
      req.flash('error', info);
      return res.redirect('/login');
    }
    req.logIn(user, function(err) {
      res.redirect('/');
    });
  })(req, res, next);
};

// 가입 GET
exports.signupGet = function(req, res) {
  if(req.user) {
    return res.redirect('/');
  }
  res.render('signup', {
    title: 'Sign up'
  });
};

// 가입 POST
exports.signupPost = function(req, res, next) {
  // 가입 폼 필드 유효성 검사
  req.assert('name', 'Empty name not allowed').notEmpty();
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('email', 'Empty email is not allowed').notEmpty();
  req.assert('password', 'Password must be at least 4 characters long').len(4);
  req.sanitize('email').normalizeEmail({ remove_dots: false });

  var errors = req.validationErrors();

  if(errors) {
    // 폼 유효성 검사에 대한 에러 메시지 표시
    req.flash('error', errors);
    return res.redirect('/signup');
  }

  // 사용자 이메일 확인
  User.findOne({ email: req.body.email }, function(err, user) {
    if(user) {
      // 사용중인 이메일이라면 메시지 출력하고 리다이렉트
      req.flash('error', { msg: 'The email is already taken.' });
      return res.redirect('/signup');
    }
    // 폼 데이터로 user 모델의 인스턴스 생성
    user = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    });
    // 사용자 저장
    user.save(function(err) {
      req.logIn(user, function(err) {
        res.redirect('/');
      });
    });
  });
};

// 프로필 계정 페이지
exports.accountGet = function(req, res) {
  res.render('profile', {
    title: 'My Account'
  });
};

// 프로필 업데이트 및 비밀번호 변경
exports.accountPut = function(req, res, next) {
  // 가입 폼 필드 유효성 검사
  if('password' in req.body) {
    req.assert('password', 'Password must be at least 4 characters long').len(4);
    req.assert('confirm', 'Passwords must match').equals(req.body.password);
  } else {
    req.assert('email', 'Email is not valid').isEmail();
    req.assert('email', 'Empty email is not allowed').notEmpty();
    req.sanitize('email').normalizeEmail({ remove_dots: false });
  }
  var errors = req.validationErrors();

  if(errors) {
    // 폼 유효성 검사에 대한 에러 메시지 표시
    req.flash('error', errors);
    return res.redirect('/pages');
  }

  user.findById(req.user.id, function(err, user) {
    // 폼 필드 비밀번호 변경 시
    if('password' in req.body) {
      user.password = req.body.password;
    } else {
      user.email = req.body.email;
      user.name = req.body.name;
    }
    // 사용자 데이터 저장하기
    user.save(function(err) {
      // 비밀번호 변경시
      if('password' in req.body) {
        req.flash('success', { msg: 'Password changed' });
      } else if(err && err.code === 11000) {
        req.flash('error', { msg: 'The email is already taken.' });
      } else {
        req.flash('success', { msg: 'Profile updated.' });
      }
      res.redirect('/account');
    });
  });
};

// 프로필 삭제
exports.accountDelete = function(req, res, next) {
  User.remove({ _id: req.user.id }, function(err) {
    req.logout();
    req.flash('info', { msg: 'Account deleted.' });
    res.redirect('/');
  });
};