var mongo = require('mongodb-wrapper');

// mongodb setup
var db = new mongo.db('127.0.0.1', 27017, 'rapleaf');
db.collection('requests'); // store all requests/responses
db.collection('emails'); // statistics per email

// webservice module config
this.title = "RapLeaf Extended API demo";
this.name = "RapLeaf Extended API";
this.version = "0.0.1";
this.endpoint = "http://localhost:8080";

// requests
exports.requests = function(options, callback) {
  db.emails.find().toArray(function(err, emails) {
    callback(err, emails);
  });
};
exports.requests.description = "List request log";

// field_counts
exports.field_counts = function(options, callback) {
  db.collection('requests.outMR'); // collection for the MR result

  db.requests.outMR.drop(function(err) { // drop it first
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
exports.field_counts.description = "Returned field frequency";
