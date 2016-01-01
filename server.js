var express = require('express');
var app = express();
var Promise = require('bluebird');
var MongoDB = Promise.promisifyAll(require('mongodb'));

global.root = __dirname;
global.env = require(global.root + '/server/env.js');

require(global.env.server + 'config.js')(app);
require(global.env.server + 'routes.js')(app);
require(global.env.server + 'errors.js')(app);


MongoDB.connectAsync( global.conf.DB_URL ).then(function(db) {
  global.db = db;
  app.listen(global.conf.PORT);
});
