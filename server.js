var express = require('express');
var app     = express();

global.root = __dirname;
global.env = require(global.root + '/server/env.js');

require(global.env.server + 'config.js')(app);
require(global.env.server + 'routes.js')(app);
require(global.env.server + 'errors.js')(app);

app.listen(global.conf.PORT);
