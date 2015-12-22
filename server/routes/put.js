'use strict';

var MongoService = require('./../services/mongo-service');

module.exports = {

    document(req, res) {
        var query = {};
        query[req.params.key] = req.params.value;
        MongoService.updateDocument(req.params.collection, query, {$set:req.body}, docs => res.send(docs));
    }
};

