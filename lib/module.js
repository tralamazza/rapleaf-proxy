/*
 * Author: Daniel Tralamazza <tralamazza@gmail.com>
 * License: MIT
 *
 * A webservice.js module for rapleaf proxy
 */

var mongo = require('mongodb-wrapper');

/*
 * TODO
 *   Do something actually cool with our historical data!
 */

var config = require('../config');

// mongodb setup
var db = new mongo.db(config.mongo.host, config.mongo.port, config.mongo.db);
db.collection(config.mongo.collection); // store all requests/responses

// webservice module config
this.title = "RapLeaf Extended API demo";
this.name = "RapLeaf Extended API";
this.version = "0.0.1";
this.endpoint = "http://localhost:8080";


// requests
exports.requests = function(options, callback) {
  var query = {};
  if (options.from) // query filter
    query.ts = { $gte: (new Date(options.from)).getTime() }
  db.requests.find(query).toArray(function(err, data) {
    callback(err, data);
  });
};
exports.requests.schema = {
  from: {
    type: 'string',
    format: 'date',
    optional: true
  }
}
exports.requests.description = "Return the full request log !!!WARNING!!!";


// fields_count (map reduce example)
exports.fields_count = function(options, callback) {
  var mr_col = config.mongo.collection + '.fields_count'; // collection for the MR result

  db.collection(mr_col); // make sure the collection exists

  var mr_opts = { out: mr_col } // map reduce options
  if (options.from) // add a query filter
    mr_opts.query = { ts: { $gte: (new Date(options.from)).getTime() } }

  // not necessary to drop, output collection is overwritten by mongodb
  db.requests.mapReduce(function() { // MAP
    if (this.result instanceof Array) { // bulk result ?
      for (var r in this.result) {
        for (var k in this.result[r]) {
          emit(k, { count: 1 });
        }
      }
    } else { // normal result
      for (var k in this.result) {
        emit(k, { count: 1 });
      }
    }
  }, function(key, values) { // REDUCE
    var t = 0;
    for (var i = 0; i < values.length; ++i)
      t += values[i].count; // sum total per key
    return { count: t };
  }, mr_opts  // OPTIONS
  , function(err) { // RESULT
    if (err)
      callback(err, null);
    else
      db.requests.fields_count.find().toArray(function(err, data) { callback(err, data); });
  });
};
exports.fields_count.schema = {
  from: {
    type: 'string',
    format: 'date',
    optional: true
  }
}
exports.fields_count.description = "List result fields and their count";


// email_history (example of a "dot notation" query with a parameter)
exports.email_history = function(options, callback) {
  var query = { "query.email": options.email };
  if (options.from)
    query.ts = { $gte: (new Date(options.from)).getTime() }
  db.requests.find(query).toArray(function(err, data) {
    callback(err, data);
  });
};
exports.email_history.schema = {
  email: {
    type: 'string',
    optional: false
  },
  from: {
    type: 'string',
    format: 'date',
    optional: true
  }
}
exports.email_history.description = "Returns all requests to a particular email";
