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
var buildRev;

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
    /*jslint stupid: true */
    buildRev = JSON.parse(fs.readFileSync(global.env.dist + 'rev-manifest.json', 'utf8'));
    /*jslint stupid: false */
    global.env.build = {
      css         : '/dist/' + buildRev['style.css'],
      mainScript  : '/dist/' + buildRev['main.js'],
      blogScript  : '/dist/' + buildRev['blog.js'],
      cvScript    : '/dist/' + buildRev['cv.js'],
      path        : '/dist/js/'
    };
  } else {
    name = 'development.json';
    global.env.build = {
      css         : '/assets/styles/style.css',
      mainScript  : '/assets/scripts/main.js',
      blogScript  : '/components/blog/blog.js',
      cvScript    : '/components/cv/cv.js',
      path        : '/components/'
    };
  }

  app.use(function (req, res, next) {
    req.locals            = {};
    req.locals.mainScript = global.env.build.mainScript;
    req.locals.blogScript = global.env.build.blogScript;
    req.locals.cvScript   = global.env.build.cvScript;
    req.locals.css        = global.env.build.css;
    req.locals.path       = global.env.build.path;
    next();
  });
  /*jslint stupid: true */
  conf = JSON.parse(fs.readFileSync(global.root + '/' + name, 'utf8'));
  /*jslint stupid: false */
  global.conf = conf;
  setDefaults(app);

};
