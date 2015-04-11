var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var async = require('async');

var mongo = exports = module.exports = {};

mongo.insertDocs = function(params, callback) {
  // open client
  MongoClient.connect(params.url, function(err, db) {
    assert.equal(null, err);
    // select collection and insert
    var collection = db.collection(params.collection);
    collection.insert(params.docs, function(err, result) {
      assert.equal(err, null);
      assert.equal(params.docs.length, result.length);
      db.close();
      callback(err, result);
    });
  });
}

mongo.find = function(params, callback) {
  MongoClient.connect(params.url, function(err, db) {
    assert.equal(null, err);
    var collection = db.collection(params.collection);
    collection.find(params.query, params.fields).toArray(function(err, items) {
      db.close();
      assert.equal(null, err);
      callback(err, items);
    });
  });
}

mongo.aggregate = function(params, callback) {
  MongoClient.connect(params.url, function(err, db) {
    assert.equal(null, err);
    var collection = db.collection(params.collection);
    collection.aggregate(params.sequence).toArray(function(err, items) {
      db.close();
      assert.equal(null, err);
      callback(err, items);
    });
  });
}