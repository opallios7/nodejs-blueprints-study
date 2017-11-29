// 모듈 가져오기
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');
// 가상 속성 사용하기
 var schemaOptions = {
   timestamps: true,
   toJSON: {
     virtuals: true
   }
 };

 // User 스키마 생성하기
 var userSchema = new mongoose.Schema({
   name: String,
   email: { type: String, unique: true },
   password: String,
   picture: String
 }, schemaOptions);

 // 비밀번호 암호화
 userSchema.pre('save', function(next) {
   var user = this;
   if(!user.isModified('password')) { return next(); }
   bcrypt.genSalt(10, function(err, salt) {
     bcrypt.hash(user.password, salt, null, function(err, hash) {
       user.password = hash;
       next();
     });
   });
 });

 // 비밀번호가 동일한지 확인
 userSchema.methods.comparePassword = function(password, cb) {
   bcrypt.compare(password, this.password, function(err, isMatch) {
     cb(err, isMatch);
   });
 };

 // 가상 속성 사용하기
 userSchema.virtual('gravatar').get(function() {
   if(!this.get('email')) {
     return 'https://gravatar.com/avatar/?s=200&d=retro';
   }
   var md5 = crypto.createHash('md5').update(this.get('email')).digest('hex');
   return 'https://gravatar.com/avatar/' + md5 + '?s=200&d=retro';
 });
 
 var User = mongoose.model('User', userSchema);
 module.exports = User;