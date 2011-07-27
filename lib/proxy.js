/*
 * Author: Daniel Tralamazza <tralamazza@gmail.com>
 *
 * RapLeaf https - https proxy
 */

var fs = require('fs'),
  url = require('url'),
  colors = require('colors'),
  mongo = require('mongodb-wrapper'),
  https = require('https'),
  httpProxy = require('http-proxy');


module.exports = function(options) {

  var options = options || {
    proxy: {
      host: '0.0.0.0',
      port: 8443
    },

    mongo: {
      host: '127.0.0.1',
      port: 27017,
      db: 'rapleaf'
    },

    https: {
      key: fs.readFileSync('./cert/key.pem', 'utf8'),
      cert: fs.readFileSync('./cert/cert.pem', 'utf8')
    }
  };

  // mongodb setup
  var db = new mongo.db(options.mongo.host, options.mongo.port, options.mongo.db);
  db.collection('requests'); // store all requests/responses

  var proxy = new httpProxy.HttpProxy();

  // proxy error event
  proxy.on('proxyError', function(err, req, res) {
    console.log('[proxy error] ' + err);
  });

  // proxy response event
  proxy.on('end', function(req, res) {
    var path = url.parse(req.url, true); // parse request url
    var bulk = null;

    if (req.method == 'POST') {
      bulk = JSON.parse(req.BODY); // process request.BODY
    } else if (req.method != 'GET') {
      console.log('request discarded, non GET/POST');
      return;
    }

    db.requests.insert({
      req_ts: req.TS, // request timestamp
      res_ts: new Date, // response timestamp
      query: path.query, // request arguments
      bulk_query: bulk, // request bulk arguments
      result: JSON.parse(res.BODY) // rapleaf result
    });
  });

  // create the proxy server
  https.createServer(options.https, function(req, res) {
    req.TS = new Date; // request received at
    req.BODY = ''; // request body
    res.BODY = ''; // response body

    // intercept request body
    req.on('data', function(chunk, encoding) {
      req.BODY += chunk.toString('utf8');
    });

    // monkey patch response.write() to intercept response body
    var o_write = res.write;
    res.write = function(chunk, encoding) {
      this.BODY += chunk.toString('utf8');
      o_write.call(this, chunk, encoding);
    };

    // proxy the request
    proxy.proxyRequest(req, res, {
      host: 'personalize.rapleaf.com',
      port: 443,
      https: true
    });
  }).listen(options.proxy.port, options.proxy.host, function() {
    var listening = options.proxy.host + ':' + options.proxy.port; 
    console.log('proxy listening on ' + listening.magenta);
  });

}
