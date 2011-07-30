/*
 * Author: Daniel Tralamazza <tralamazza@gmail.com>
 * License: MIT
 *
 * RapLeaf proxy
 *
 * TODO
 *    Fix node-http-proxy content-length/transfer-encoding bug
 */

var url = require('url'),
  colors = require('colors'),
  mongo = require('mongodb-wrapper'),
  http = require('http'),
///  https = require('https'),
  httpProxy = require('http-proxy');


module.exports = function(options) {

  var options = require('../config');

  // mongodb setup
  var db = new mongo.db(options.mongo.host, options.mongo.port, options.mongo.db);
  db.collection(options.mongo.collection); // store all requests/responses

  var proxy = new httpProxy.HttpProxy();

  // proxy error event
  proxy.on('proxyError', function(err, req, res) {
    console.log('[proxy error] ' + err + ''.red);
  });

  // proxy response event
  proxy.on('end', function(req, res) {
    var path = url.parse(req.url, true); // parse request url
    var bulk = null;

    if (req.method == 'POST') {
      bulk = JSON.parse(req.BODY); // process request.BODY
    } else if (req.method != 'GET') {
      console.log('request discarded, non GET/POST'.red);
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
  http.createServer(function(req, res) {
///  https.createServer(options.https, function(req, res) {
    req.TS = new Date; // request received at
    req.BODY = ''; // request body
    res.BODY = ''; // response body

    // intercept request body
    req.on('data', function(chunk, encoding) {
      req.BODY += chunk;
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
