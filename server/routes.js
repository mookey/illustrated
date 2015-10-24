'use strict';

var moment = require('moment');

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

  app.get('/:pane?', function (req, res) {
    var posts = [];
    var host ='images/';
    var pane;
    var now;

    moment.locale('sv');
    now = moment().format("dddd D MMM YYYY");




    posts.push({
      text    : '<p></p>',
      author  : 'consiglieri',
      date    : new Date(2015, 9, 10),
      humanDate : '10 oktober 2015',
      header  : 'The usual suspects',
      extract : 'Vänner från förr...',
      template : 'centered_bottom',
      media   : [
        {
          src     : host + 'suspects.jpg',
          type    : 'image',
          view    : 'landscape',
          width   : 800,
          height  : 600,
          aspect  : 75
        },
        {
          src     : host + 'burn.jpg',
          type    : 'image',
          view    : 'landscape',
          width   : 800,
          height  : 600,
          aspect  : 75
        }
      ],
      notes : [
        {
          note : 'Well, I\'m pissed an vinigera again, Cause I think that I\'ve lost my best friend'
        }
      ]
    });



    posts.push({
      text    : '<p></p>',
      author  : 'consiglieri',
      date    : new Date(2015, 8, 5),
      humanDate : '5 sep 2015',
      header  : 'The main man',
      extract : 'The top dog',
      template : 'left_gallery',
      media   : [
        {
          src     : host + 'main_man_toned.jpg',
          type    : 'image',
          view    : 'portrait',
          width   : 800,
          height  : 1092,
          aspect  : 136.5
        },
        {
          src     : host + 'pops_main_man.jpg',
          type    : 'image',
          view    : 'portrait',
          width   : 800,
          height  : 1092,
          aspect  : 136.5
        },
        {
          src     : host + 'tim_syster.jpg',
          type    : 'image',
          view    : 'portrait',
          width   : 800,
          height  : 1092,
          aspect  : 136.5
        }
      ],
      notes : [
        {
          note : 'Well, I\'m pissed an vinigera again, Cause I think that I\'ve lost my best friend'
        }
      ]
    });


    posts.push({
      text    : '<p></p>',
      author  : 'consiglieri',
      date    : new Date(2015, 8, 4),
      humanDate : '4 sep 2015',
      header  : 'Mina ömma föräldrar',
      extract : '',
      template : 'left_bottom',
      media   : [
        {
          src     : host + 'mom_pops.jpg',
          type    : 'image',
          view    : 'portrait',
          width   : 800,
          height  : 1092,
          aspect  : 136.5
        },
        {
          src     : host + 'mom_pops_main_man.jpg',
          type    : 'image',
          view    : 'landscape',
          width   : 800,
          height  : 600,
          aspect  : 75
        }
      ]
    });


    posts.sort(function(a, b) {
      if (a.date > b.date) {
        return -1;
      }
      if (a.date < b.date) {
        return 1;
      }
      return 0;
    });


    pane = req.params.pane || 'blog';
    pane = pane.toLowerCase();

    req.locals.pane   = pane;
    req.locals.posts  = posts;
    req.locals.now    = now;

    r(req, res, req.locals);
  });

};