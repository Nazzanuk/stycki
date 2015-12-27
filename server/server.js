'use strict';

//npm dependencies
var express = require('express'),
    cors = require('cors'),
    bodyParser = require('body-parser'),
    app = express();

//local dependencies
var routes = require('./routes/routes');

//server setup
var port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use('/public', express.static('../release/public'));
app.set('view engine', 'ejs');

var server = app.listen(port, () => {
    console.log('Example app listening at http://%s:%s', server.address().address, port);
});

routes.init(app);
var io = require('socket.io')(server);

var socket = require('./services/socket');
socket.events(io);

module.exports = server;