var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.render('index', {
    title: 'Socket.io chat application',
    lead: 'Insert your user name and start talk'
  });
});
module.exports = router;