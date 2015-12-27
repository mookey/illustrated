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
    var pane;
    var now;

    moment.locale('sv');
    now = moment().format("dddd D MMM YYYY");

    // posts.push({
    //   text    : '<p></p>',
    //   author  : 'garhammar',
    //   date    : new Date(2015, 11, 24),
    //   humanDate : '24 dec 2015',
    //   header  : 'Julafton',
    //   extract : '',
    //   template : 'centered_bottom',
    //   media   : [
    //     {
    //       src     : host + 'jul_1_2015.jpg',
    //       type    : 'image',
    //       view    : 'landscape',
    //       width   : 1000,
    //       height  : 750
    //     },
    //     {
    //       src     : host + 'jul_2015.jpg',
    //       type    : 'image',
    //       view    : 'landscape',
    //       width   : 1000,
    //       height  : 750
    //     }
    //   ],
    //   notes : [
    //     {
    //       note : 'Well, I\'m pissed an vinigera again, Cause I think that I\'ve lost my best friend'
    //     }
    //   ]
    // });
    //
    //
    // posts.push({
    //   text    : '<p>Kidnap the Sandy Claws,<br/>beat him with a stick<br/>Lock him for ninety years,<br/>see what makes him tick</p>',
    //   author  : 'garhammar',
    //   date    : new Date(2015, 11, 23),
    //   humanDate : '23 dec 2015',
    //   header  : 'Nightmare before Christmas',
    //   extract : '',
    //   template : 'centered_bottom',
    //   media   : [
    //     {
    //       src     : host + 'jul_2_2015.jpg',
    //       type    : 'image',
    //       view    : 'landscape',
    //       width   : 1000,
    //       height  : 750
    //     },
    //     {
    //       src     : 'https://www.youtube.com/embed/Ry7PcYtKPhA',
    //       type    : 'youtube',
    //       view    : 'landscape',
    //       width   : 16,
    //       height  : 9
    //     }
    //   ]
    // });
    //
    // posts.push({
    //   text    : '<p></p>',
    //   author  : 'garhammar',
    //   date    : new Date(2015, 11, 6),
    //   humanDate : '6 dec 2015',
    //   header  : 'Syster och bror. Main man och Dixon',
    //   extract : '',
    //   template : 'centered_bottom',
    //   media   : [
    //     {
    //       src     : host + 'huset.jpg',
    //       type    : 'image',
    //       view    : 'landscape',
    //       width   : 800,
    //       height  : 600
    //     },
    //     {
    //       src     : host + 'familja.jpg',
    //       type    : 'image',
    //       view    : 'landscape',
    //       width   : 800,
    //       height  : 600
    //     }
    //   ],
    //   notes : [
    //     {
    //       note : 'Well, I\'m pissed an vinigera again, Cause I think that I\'ve lost my best friend'
    //     }
    //   ]
    // });
    //
    //
		// posts.push({
    //   text    : '<p></p>',
    //   author  : 'garhammar',
    //   date    : new Date(2015, 10, 20),
    //   humanDate : '20 nov 2015',
    //   header  : 'Edinburgh',
    //   extract : 'Sista smörjelsen',
    //   template : 'left_gallery',
    //   media   : [
    //     {
    //       src     : host + 'gate.jpg',
    //       type    : 'image',
    //       view    : 'portrait',
    //       width   : 600,
    //       height  : 800
    //     },
    //     {
    //       src     : host + 'castle.jpg',
    //       type    : 'image',
    //       view    : 'portrait',
		// 			width   : 600,
    //       height  : 800
    //     },
    //     {
    //       src     : host + 'john.jpg',
    //       type    : 'image',
    //       view    : 'portrait',
		// 			width   : 600,
    //       height  : 800
    //     }
    //   ],
    //   notes : [
    //     {
    //       note : 'Well, I\'m pissed an vinigera again, Cause I think that I\'ve lost my best friend'
    //     }
    //   ]
    // });
    //
    //
    //
    // posts.push({
    //   text    : '<p></p>',
    //   author  : 'garhammar',
    //   date    : new Date(2015, 9, 10),
    //   humanDate : '10 oktober 2015',
    //   header  : 'The usual suspects',
    //   extract : 'Vänner från förr...',
    //   template : 'centered_bottom',
    //   media   : [
    //     {
    //       src     : host + 'suspects.jpg',
    //       type    : 'image',
    //       view    : 'landscape',
    //       width   : 800,
    //       height  : 600
    //     },
    //     {
    //       src     : host + 'burn.jpg',
    //       type    : 'image',
    //       view    : 'landscape',
    //       width   : 800,
    //       height  : 600
    //     }
    //   ],
    //   notes : [
    //     {
    //       note : 'Well, I\'m pissed an vinigera again, Cause I think that I\'ve lost my best friend'
    //     }
    //   ]
    // });
    //
    //
    //
    // posts.push({
    //   text    : '<p></p>',
    //   author  : 'garhammar',
    //   date    : new Date(2015, 8, 5),
    //   humanDate : '5 sep 2015',
    //   header  : 'The main man',
    //   extract : 'The top dog',
    //   template : 'left_gallery',
    //   media   : [
    //     {
    //       src     : host + 'main_man_toned.jpg',
    //       type    : 'image',
    //       view    : 'portrait',
    //       width   : 800,
    //       height  : 1092
    //     },
    //     {
    //       src     : host + 'pops_main_man.jpg',
    //       type    : 'image',
    //       view    : 'portrait',
    //       width   : 800,
    //       height  : 1092
    //     },
    //     {
    //       src     : host + 'tim_syster.jpg',
    //       type    : 'image',
    //       view    : 'portrait',
    //       width   : 800,
    //       height  : 1092
    //     }
    //   ],
    //   notes : [
    //     {
    //       note : 'Well, I\'m pissed an vinigera again, Cause I think that I\'ve lost my best friend'
    //     }
    //   ]
    // });
    //
    //
    // posts.push({
    //   text    : '<p></p>',
    //   author  : 'garhammar',
    //   date    : new Date(2015, 8, 4),
    //   humanDate : '4 sep 2015',
    //   header  : 'Mina ömma föräldrar',
    //   extract : '',
    //   template : 'left_bottom',
    //   media   : [
    //     {
    //       src     : host + 'mom_pops.jpg',
    //       type    : 'image',
    //       view    : 'portrait',
    //       width   : 800,
    //       height  : 1092
    //     },
    //     {
    //       src     : host + 'mom_pops_main_man.jpg',
    //       type    : 'image',
    //       view    : 'landscape',
    //       width   : 800,
    //       height  : 600
    //     }
    //   ]
    // });


    // , {
    //     "limit": 20,
    //     "skip": 10,
    //     "sort": [['field1','asc'], ['field2','desc']]
    // }

    var isDynamic = false;

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