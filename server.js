#!/usr/bin/env node

var logger = require('./etc/logger');

var app = require('./app');
var http = require('http');

var port = process.env.PORT || '6677';
app.set('port', port);

var server = http.createServer(app);

server.listen(port);
server.on('error', onError);

logger.info('hello');

function onError(error) {
}