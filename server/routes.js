'use strict';

var fs = require('fs');
var request = require('request');
var moment = require('moment');
var handlebars = require('handlebars');
var multer = require('multer');
var ObjectId = require('mongodb').ObjectID;

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

var upload = multer({ storage: storage });

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

  function insertPost( post ) {
    return new Promise(function (resolve, reject) {
      global.db.collection( global.conf.DB_COLLECTION_POSTS )
        .insertAsync( post )
        .then(function() {
          resolve();
        });
    });
  }

  function updatePost( post ) {
    return new Promise(function (resolve, reject) {
      global.db.collection( global.conf.DB_COLLECTION_POSTS )
        .updateAsync({
          '_id' : ObjectId(post.id)
        }, post)
        .then(function() {
          resolve();
        });
    });
  }

  function getPosts( opts, limit, isDynamic ) {
    return new Promise(function (resolve, reject) {
      global.db.collection( global.conf.DB_COLLECTION_POSTS )
        .findAsync( opts, limit )
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
    var limits = {
      limit : 3,
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
    getPosts( opts, limits, isDynamic )
      .then(function( posts ) {
        res.send( posts );
      }).catch(function( err ) {
        console.log( err );
        res.sendStatus( 500 );
      });
  });

  app.post('/admin', upload.array('src[]', 3), function( req, res ) {

    if ( req.body.token !== 'fuckrrr' ) {
      res.redirect('/admin');
      return;
    }

    var post = {
      header : req.body.header,
      date : moment(req.body.date).toDate(),
      isPublished : req.body.isPublished === 'on',
      author : req.body.author,
      extract : req.body.extract,
      text : req.body.text,
      template : req.body.template,
      media : []
    };

    var i = 0;
    var len = req.files.length;
    for ( i = 0; i < len; i++ ) {
      post.media.push({
        src : 'images/' + req.files[i].originalname,
        type : req.body.type[i],
        width : req.body.width[i],
        height : req.body.height[i]
      });
    }


    if ( req.body.id ) {
      post.id = req.body.id;
      updatePost( post )
        .then(function() {
          res.redirect('/admin');
        })
        .catch(function() {
          res.sendStatus( 500 );
        });
      return;
    }

    insertPost( post )
      .then(function() {
        res.redirect('/admin');
      })
      .catch(function() {
        res.sendStatus( 500 );
      });
  });


  app.get('/admin', function( req, res ) {
    var pane;
    var now;

    moment.locale('sv');
    now = moment().format('D MMM YYYY');

    var limits = {
      sort : {
        date : -1
      }
    };

    getPosts( {}, limits, false )
      .then(function( posts ) {
        posts.forEach(function(post) {
          post.media.forEach(function(media) {
            if (media.type === 'image') {
              media.isImage = true;
            }
            if (media.type === 'youtube') {
              media.isYoutube = true;
            }
            if (media.view === 'landscape') {
              media.isLandscape = true;
            }
            if (media.view === 'portrait') {
              media.isPortrait = true;
            }
          });
        });
        req.locals.posts = posts;
        req.locals.now = now;
        req.locals.layout = false;
        res.render('admin', req.locals);
      }).catch(function(err) {
        console.log(err);
        res.sendStatus(500);
      });
  });

  app.get('/:pane?', function( req, res ) {
    var isDynamic = false;
    var pane;
    var now;

    moment.locale('sv');
    now = moment().format("dddd D MMM YYYY");

    var limits = {
      limit : 3,
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

    getPosts( opts, limits, isDynamic )
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



  function addPostProperties( post, isDynamic ) {
    var d = moment( post.date );
    post.url = '/blog/' + d.format('YYYY_MM_DD');
    post.humanDate = d.format('D MMM YYYY');
    post.date = d.format('YYYY-MM-DD')
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