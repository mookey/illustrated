'use strict';

var moment = require('moment');
var handlebars = require('handlebars');
var db = require(global.env.server + 'db.js');

module.exports = function(app) {

  app.post('/admin', db.upload.array('src[]', 3), function( req, res ) {

    // if ( req.body.token !== 'fuckrrr' ) {
    //   res.redirect('/admin');
    //   return;
    // }

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
      updatePost( post );
    } else {
      insertPost( post );
    }

  });

  function updatePost( post ) {
    db.updatePost( post )
      .then(function() {
        res.redirect('/admin');
      })
      .catch(function() {
        res.sendStatus( 500 );
      });
  };

  function insertPost( post ) {
    db.insertPost( post )
      .then(function() {
        res.redirect('/admin');
      })
      .catch(function() {
        res.sendStatus( 500 );
      });
  }


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

    db.getPosts( {}, limits, false )
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

};