const path = require('path');
const rootPath = path.normalize(__dirname + '/..');
const env = process.env.NODE_ENV || 'development';

const config = {
  development: {
    root: rootPath,
    app: {
      name: 'ch-05'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost/ch-05-development'
  },

  test: {
    root: rootPath,
    app: {
      name: 'ch-05'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost/ch-05-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'ch-05'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost/ch-05-production'
  }
};

module.exports = config[env];
