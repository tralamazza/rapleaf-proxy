var mongo = require('mongodb-wrapper');

// mongodb setup
var db = new mongo.db('127.0.0.1', 27017, 'rapleaf');
db.collection('requests'); // store all requests/responses

// webservice module config
this.title = "RapLeaf Extended API demo";
this.name = "RapLeaf Extended API";
this.version = "0.0.1";
this.endpoint = "http://localhost:8080";

// requests
exports.requests = function(options, callback) {
  db.requests.find().toArray(function(err, emails) {
    callback(err, emails);
  });
};
exports.requests.description = "Return the full request log !!!WARNING!!!";

// field_counts
exports.fields_count = function(options, callback) {
  db.collection('requests.outMR'); // collection for the MR result

  db.requests.outMR.drop(function(err) { // drop it first (necessary?)
    db.requests.mapReduce(function() { // MAP
      for (var k in this.result)
        emit(k, 1); // emit every attribute
    }, function(key, values) { // REDUCE
      var t = 0;
      for (var i = 0; i < values.length; ++i)
        t += values[i];
      return { count: t };
    }, { // STORED
      out: "requests.outMR"
    }, function(err) {
      if (err) {
        callback(err, null);
        return;
      }
      db.requests.outMR.find().toArray(function(err, data) {
        callback(err, data);
      });
    });
  });
};
exports.fields_count.description = "List result fields and their count";


