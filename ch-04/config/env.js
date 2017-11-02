// Env 변수 가져오기 / 클라우디너리
module.exports = function(app, configEnv) {

  var dotenv = require('dotenv');
  dotenv.load();
  var cloudinary = require('cloudinary').v2;
  // 터미널에 로그 메시지 쓰기
  if( typeof(process.env.CLOUDINARY_URL) == 'undefined' ) {
    console.log('Cloudinary config file is not defined');
    console.log('Setup CLOUDINARY_URL or use dotenv mdule file');
  } else {
    console.log('Cloudinary config, successfully used:');
    console.log(cloudinary.config());
  }
}