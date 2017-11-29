// 홈페이지 렌더링
exports.index = function(req, res) {
  res.render('home', {
    title: 'Home'
  });
};