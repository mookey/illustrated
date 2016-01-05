'use strict';

var moment = require('moment');
var handlebars = require('handlebars');
var db = require(global.env.server + 'db.js');

module.exports = function(app) {

  app.post('/admin', db.upload.fields([{ name: 'first[]', maxCount: 3 }, { name: 'second[]', maxCount: 3 }, { name: 'third[]', maxCount: 3 } ]), function( req, res ) {

    if ( req.body.username !== global.conf.username || req.body.password !== global.conf.password ) {
      res.sendStatus( 401 );
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

    addFile( 0, post, req );
    addFile( 1, post, req );
    addFile( 2, post, req );

    if ( req.body.id ) {
      post.id = req.body.id;
      updatePost( post, res );
    } else {
      insertPost( post, res );
    }

  });

  function addFile( number, post, req ) {
    var file;
    var src;
    var type;
    var names;
    if ( number === 0 ) {
      file = req.files['first[]'] && req.files['first[]'][0];
    } else if ( number === 1 ) {
      file = req.files['second[]'] && req.files['second[]'][0];
    } else if ( number === 2 ) {
      file = req.files['third[]'] && req.files['third[]'][0];
    }

    if ( file ) {
      type = req.body.type[ number ];
      if ( type === 'video' ) {
        names = file.originalname.split('.');
        names.pop();
        src = names.join('');
      } else {
        src = file.originalname;
      }

      post.media.push({
        src : 'images/' + src,
        type : req.body.type[ number ],
        width : req.body.width[ number ],
        height : req.body.height[ number ]
      });
    }
  }

  function updatePost( post, res ) {
    db.updatePost( post )
      .then(function() {
        res.sendStatus( 200 );
      })
      .catch(function() {
        res.sendStatus( 500 );
      });
  };

  function insertPost( post, res ) {
    db.insertPost( post )
      .then(function() {
        res.sendStatus( 200 );
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