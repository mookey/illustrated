'use strict';

var express       = require('express');
var exphbs        = require('express-handlebars');
var handlebars    = require('handlebars');
var compression   = require('compression');
var session       = require('express-session');
var fs            = require('fs');
var bodyParser    = require('body-parser');
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
      app.use(compression());
      app.use(express.static(global.env.public, { maxAge: maxAge }));
      app.enable('strict routing');
      app.enable('case sensitive routing');
      app.use(bodyParser.json());
      app.use(bodyParser.urlencoded({ extended: true }));
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
    buildRev = require(global.env.dist + 'rev-manifest.json');
    global.env.build = {
      css         : '/dist/' + buildRev['style.css'],
      adminStyles : '/dist/styles/admin.css',
      adminScript : '/dist/js/admin.js',
      mainScript  : '/dist/' + buildRev['main.js'],
      blogScript  : '/dist/' + buildRev['blog.js'],
      cvScript    : '/dist/' + buildRev['cv.js'],
      templates   : '/dist/' + buildRev['templates.js'],
      path        : '/dist/js/'
    };
  } else {
    name = 'development.json';
    global.env.build = {
      css         : '/assets/styles/style.css',
      adminStyles : '/assets/styles/admin.css',
      adminScript : '/assets/scripts/admin.js',
      mainScript  : '/assets/scripts/main.js',
      blogScript  : '/components/blog/blog.js',
      cvScript    : '/components/cv/cv.js',
      templates   : '/dist/templates.js',
      path        : '/components/'
    };
  }

  app.use(function (req, res, next) {
    req.locals            = {};
    req.locals.mainScript = global.env.build.mainScript;
    req.locals.blogScript = global.env.build.blogScript;
    req.locals.cvScript   = global.env.build.cvScript;
    req.locals.templates  = global.env.build.templates;
    req.locals.css        = global.env.build.css;
    req.locals.adminStyles = global.env.build.adminStyles;
    req.locals.adminScript = global.env.build.adminScript;
    req.locals.path       = global.env.build.path;
    next();
  });
  conf = require(global.root + '/' + name, 'utf8');
  global.conf = conf;
  setDefaults(app);

};
