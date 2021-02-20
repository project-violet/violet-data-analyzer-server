//===----------------------------------------------------------------------===//
//
//                            Violet API Server
//
//===----------------------------------------------------------------------===//
//
//  Copyright (C) 2021. violet-team. All Rights Reserved.
//
//===----------------------------------------------------------------------===//

const express = require('express');
const createError = require('http-errors');
const expressDefend = require('express-defend');
const blacklist = require('express-blacklist');
const rateLimit = require('express-rate-limit');

const app = express();

app.disable('x-powered-by');

app.use(express.json());

// Ban ip address
app.use(blacklist.blockRequests('blacklist.txt'));
app.use(expressDefend.protect({
  maxAttempts: 1,
  dropSuspiciousRequest: true,
  onMaxAttemptsReached: function(ipAddress, url) {
    blacklist.addAddress(ipAddress);
  },
}));

// Limit Request
const limiter = rateLimit({
  windowMs: 1000 * 60,
  max: 5 * 6,
});
app.use(limiter);
app.get('/', function(req, res) {
  res.redirect('/api-docs');
});

// Since it is filtered by nginx, the routing below should not be valid.
app.use(function(req, res, next) {
  res.status(404).type('html').send(p.p404);
});

module.exports = app;