'use strict';

//npm dependencies
var express = require('express'),
    cors = require('cors'),
    bodyParser = require('body-parser'),
    app = express(),
    http = require('http').Server(app),
    io = require('socket.io')(http);

//local dependencies
var routes = require('./routes/routes');

//server setup
var app = express(),
    port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static('../release'));
app.set('view engine', 'ejs');

var server = app.listen(port, () => {
    console.log('Example app listening at http://%s:%s', server.address().address, port);
});

//app init
//routes.init(app);

//socket.io

var io = require('socket.io')(5001);

var socket = require('./services/socket');
socket.events(io);

module.exports = server;