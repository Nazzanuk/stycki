'use strict';

var MongoService = require('./../services/mongo-service'),
    shortid = require('shortid');

module.exports = {

    document(req, res) {
        req.body._id = shortid.generate();
        MongoService.insertDocument(req.params.collection, req.body, docs => res.send(docs));
    }
};

