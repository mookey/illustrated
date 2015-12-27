'use strict';

var moment = require('moment');
var handlebars = require('handlebars');


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

  app.get('/me', function (req, res) {
    res.redirect(301, '/cv');
  });

  app.get('/blog/:date', function (req, res) {
    var date = moment( req.params.date, 'YYYY_MM_DD').toDate();
    var isDynamic = true;
    global.db.collection( global.conf.DB_COLLECTION_POSTS )
    .findAsync({
      date : {
        $lt : date
      }
    }, {
      limit : 3,
      sort : {
        date : -1
      }
    })
    .then(function( cursor ) {
      return cursor.toArrayAsync();
    })
    .then(function( posts ) {
      posts.forEach( function( post ) { addPostProperties( post, isDynamic ); } );
      res.send(posts);
    }).catch(function(err) {
      console.log(err);
      res.sendStatus(500);
    });

  });

  app.get('/:pane?', function (req, res) {
    var host ='images/';
    var isDynamic = false;
    var pane;
    var now;

    moment.locale('sv');
    now = moment().format("dddd D MMM YYYY");

    global.db.collection( global.conf.DB_COLLECTION_POSTS )
      .findAsync({}, {
        limit : 3,
        sort : {
          date : -1
        }
      })
      .then(function(cursor) {
        return cursor.toArrayAsync();
      })
      .then(function( posts ) {
        posts.forEach( function( post ) { addPostProperties( post, isDynamic ); } );
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



  function addPostProperties( post, isDynamic ) {
    post.url = '/blog/' + moment( post.date ).format('YYYY_MM_DD');
    post.isDynamic = isDynamic;
    post.media.forEach(function( media ) {
      media.aspect = 100 * (media.height / media.width);
    });

    if ( post.template === 'left_bottom' ) {
      post.isLeftBottom = true;
    }
    if ( post.template === 'left_gallery' ) {
      post.isLeftGallery = true;
    }
    if ( post.template === 'centered_bottom' ) {
      post.isCenteredBottom = true;
    }
  }

};