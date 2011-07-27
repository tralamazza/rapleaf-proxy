/*
 * Author: Daniel Tralamazza <tralamazza@gmail.com>
 *
 * Starts the proxy and webservice
 */

var ws = require('webservice'),
  ws_module = require('./lib/module'),
  colors = require('colors'),
  proxy = require('./lib/proxy');

// start webservice
ws.createServer(ws_module).listen(8080, '0.0.0.0', function() {
  console.log('webservice listening on ' + '0.0.0.0:8080'.cyan);
});

// start proxy
proxy();
