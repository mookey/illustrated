'use strict';

var moment = require('moment');
var handlebars = require('handlebars');
var multer  = require('multer');
var upload = multer();

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


  function getPosts( date, isDynamic ) {
    return new Promise(function (resolve, reject) {
      var opts = {};
      if ( date ) {
        opts.date = {
          $lt : date
        };
      }
      global.db.collection( global.conf.DB_COLLECTION_POSTS )
        .findAsync( opts, {
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
          resolve( posts );
        });
    });
  }

  app.get('/blog/:date', function( req, res ) {
    var date = moment( req.params.date, 'YYYY_MM_DD').toDate();
    var isDynamic = true;
    getPosts( date, isDynamic )
      .then(function( posts ) {
        res.send( posts );
      }).catch(function( err ) {
        console.log( err );
        res.sendStatus( 500 );
      });
  });

  app.post('/admin', upload.array(), function( req, res ) {
    console.log( req.body );
    res.sendStatus(200);
  });

  app.get('/:pane?', function( req, res ) {
    var isDynamic = false;
    var pane;
    var now;

    moment.locale('sv');
    now = moment().format("dddd D MMM YYYY");

    getPosts( null, isDynamic )
      .then(function( posts ) {
        pane = req.params.pane || 'blog';
        pane = pane.toLowerCase();
        req.locals.pane = pane;
        req.locals.posts = posts;
        req.locals.now = now;
        if ( pane === 'admin' ) {
          req.locals.layout = false;
          res.render('admin', req.locals);
          return;
        }
        r(req, res, req.locals);
      }).catch(function(err) {
        console.log(err);
        res.sendStatus(500);
      });
  });



  function addPostProperties( post, isDynamic ) {
    post.url = '/blog/' + moment( post.date ).format('YYYY_MM_DD');
    post.isDynamic = isDynamic;
    post.id = post._id;
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