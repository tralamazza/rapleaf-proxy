var fs = require('fs');

module.exports = {
    proxy: {
      host: '0.0.0.0',
      port: 8081
    },

    mongo: {
      host: '127.0.0.1',
      port: 27017,
      db: 'rapleaf',
      collection: 'requests'
    },

///    https: {
///      key: fs.readFileSync('./cert/key.pem', 'utf8'),
///      cert: fs.readFileSync('./cert/cert.pem', 'utf8')
///    }
};
