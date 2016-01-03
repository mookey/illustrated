'use strict';

var fs = require('fs');
var moment = require('moment');
var handlebars = require('handlebars');
var db = require(global.env.server + 'db.js');
var NUMBER_OF_POSTS_PER_REQUEST = 5;

module.exports = function(app) {

  function r(req, res, data) {
    if (req.xhr) {
      res.send(data);
      return;
    }
    res.render('body', data);
  }

  // function addNote(text) {
  //   return '<div class="note odd">' + text + '</div>';
  // }



  app.get('/blog/:date', function( req, res ) {
    var date = moment( req.params.date, 'YYYY_MM_DD').toDate();
    var isDynamic = true;
    var limits = {
      limit : NUMBER_OF_POSTS_PER_REQUEST,
      sort : {
        date : -1
      }
    };
    var opts = {
      isPublished : true,
      date : {
        $lt : date
      }
    };
    db.getPosts( opts, limits, isDynamic )
      .then(function( posts ) {
        res.send( posts );
      }).catch(function( err ) {
        console.log( err );
        res.sendStatus( 500 );
      });
  });


  app.get('/:pane?', function( req, res ) {
    var isDynamic = false;
    var pane;
    var now;

    moment.locale('sv');
    now = moment().format("dddd D MMM YYYY");

    var limits = {
      limit : NUMBER_OF_POSTS_PER_REQUEST,
      sort : {
        date : -1
      }
    };

    var opts = {
      isPublished : true
    };
    if ( req.query.show === 'all' ) {
      opts = {};
    }

    db.getPosts( opts, limits, isDynamic )
      .then(function( posts ) {
        pane = req.params.pane || 'blog';
        pane = pane.toLowerCase();
        req.locals.pane = pane;
        req.locals.posts = posts;
        req.locals.now = now;
        r(req, res, req.locals);
      }).catch(function(err) {
        console.log(err);
        res.sendStatus(500);
      });
  });


};