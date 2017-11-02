

const express = require('express');
const config = require('./config/config');

const app = express();

module.exports = require('./config/express')(app, config);

// 클라우디너리 환경 설정 가져오기
require('./config/env')(app);

app.listen(config.port, () => {
  console.log('Express server listening on port ' + config.port);
});

