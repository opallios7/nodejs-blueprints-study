// 모듈 가져오기
var request = require('supertest');
var server = require('../server');

// 테스트 01
describe('GET /', function() {
  it('should render ok', function(done) {
    request(server)
    .get('/')
    // 예상되는 결과
    .expect(200, done);
  });
});

// 테스트 02
describe('GET /bikes', function() {
  it('should not found', function(done) {
    request(server)
    .get('/bikes')
    .expect(404, done);
  });
});

