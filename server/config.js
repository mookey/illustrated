'use strict';

var express       = require('express');
var exphbs        = require('express-handlebars');
var handlebars    = require('handlebars');
var compress      = require('compression')();
var session       = require('express-session');
var fs            = require('fs');
var PROD          = 'production';
var DEV           = 'development';
var conf;
var name;

module.exports = function(app) {

  require(global.env.server + 'handlebars-helpers')(handlebars);

  function setDefaults(app) {
      var hbs;
      var maxAge = 1000 * 60 * 60 * 24 * 365;
      app.use(express.static(global.env.public, { maxAge: maxAge }));
      app.enable('strict routing');
      app.enable('case sensitive routing');
      app.use(compress);
      app.set('views', global.env.components);
      hbs = exphbs.create({
        handlebars    : handlebars,
        defaultLayout : 'index',
        layoutsDir    : app.get('views'),
        partialsDir   : app.get('views'),
        extname       : '.html'
      });
      app.engine('.html', hbs.engine);
      app.set('view engine', '.html');
  }

  if (process.env.NODE_ENV === PROD) {
    name = 'production.json';
  } else {
    name = 'development.json';
  }

  /*jslint stupid: true */
  conf = JSON.parse(fs.readFileSync(global.root + '/' + name, 'utf8'));
  /*jslint stupid: false */
  global.conf = conf;
  setDefaults(app);

};
