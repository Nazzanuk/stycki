'use strict';

var assert = require('assert'),
    MongoClient = require('mongodb').MongoClient;

//var db, url = 'mongodb://capi:capi@ds045644.mongolab.com:45644/capi';
var db, url = 'mongodb://wllSpace:wllSpace@ds033865.mongolab.com:33865/wll-space';

MongoClient.connect(url, (err, database) => {
    db = database;
    assert.equal(null, err);
    console.log("Connected correctly to server");
});

module.exports = {
    getCollections(callback) {
        db.listCollections().toArray((err, docs) => callback(docs));
    },

    findDocuments(collection, data, fields, callback) {
        db.collection(collection).find(data, fields).toArray((err, docs) => callback(docs));
    },

    insertDocument(collection, data, callback) {
        db.collection(collection).insert(data, (err, docs) => callback(docs));
    },

    updateDocument(collection, query, data, callback) {
        db.collection(collection).update(query, data, (err, docs) => callback(docs));
    },

    removeDocument(collection, query, callback) {
        db.collection(collection).deleteOne(query, (err, docs) => callback(docs));
    }
};