var express = require('express');
var app     = express();

global.root = __dirname;
global.env = require(global.root + '/server/env.js');

console.log('global', global.env);

require(global.env.server + 'config.js')(app);
require(global.env.server + 'routes.js')(app);
require(global.env.server + 'errors.js')(app);

/**
require('./server/config/config.js')(app);
require('./server/controllers/routes.js')(app);
require('./server/controllers/admin.js')(app);
require('./server/config/errors.js')(app);*/

// console.log('port',process.env.PORT);

app.listen(global.env.PORT);
