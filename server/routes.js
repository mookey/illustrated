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

  function addNote(text) {
    return '<div class="note odd">' + text + '</div>';
  }

  function addImage(media) {
    var w = media.width;
    var h = media.height;
    var aspect = (h / w) * 100;

    if (media.block) {
      return '<div class="image-container block"><div style="width:100%; padding-bottom:' + aspect + '%"><div class="image invisible" data-image-src="' + media.src + '"></div></div></div>';
    }

    if (media.left) {
      return '<div class="image-container image-left"><div style="padding-bottom:' + aspect + '%"><div class="image invisible" data-image-src="' + media.src + '"></div></div></div>';
    }

    return '<div class="image-container image-right"><div style="padding-bottom:' + aspect + '%"><div class="image invisible image-right" data-image-src="' + media.src + '"></div></div></div>';
  }


  app.get('/:pane?', function (req, res) {
    var data = [];
    // var host = 'https://googledrive.com/host/0B6HtzsiMSfisfl9IVHZ2RUYzZ2lzOG53MzNmUUg3clkxWUZLUjBfUjN3eTVHVlBlZ0tVSmM/';
    var host ='img/';
    var pane;
    var now;

    moment.locale('sv');
    now = moment().format("dddd D MMM YYYY");



    data.push({
      text    : '<p>...det finns ytterligare en skön lirar som aspirerar på titeln - the \'Main man\', min systerson. Jag kallar honom \'Main man\', kommer så för alltid göra om inte \'Main man\' själv har synpunkter på smeknamnet. Ni ser, jag har aldrig träffat någon som den här ståtlige 102 cm långe mannen.</p><div><div>{{img}}{{img}}{{img}}</div>',
      author  : 'consiglieri',
      date    : new Date(),
      humanDate : '4 sep 2015',
      header  : '...he\'s the main motherfuckin\' man',
      extract : 'Min ömme bror jag ansett, uppriktigt och innerligt, världens näst bästa grabb. Visar sig...',
      headerImage : {
        src     : host + 'main_man_toned.jpg',
        type    : 'image',
        view    : 'portrait',
        width   : 800,
        height  : 1092,
        block   : false,
        left    : true
      },
      media   : [
        {
          src     : host + 'main_man.jpg',
          type    : 'image',
          view    : 'portrait',
          width   : 800,
          height  : 1092
        },
        {
          src     : host + 'main_man_toned.jpg',
          type    : 'image',
          view    : 'portrait',
          width   : 800,
          height  : 1092
        },
        {
          src     : host + 'IMG_20150723_124241_1.jpg',
          type    : 'image',
          view    : 'portrait',
          width   : 800,
          height  : 1067,
          block   : false,
          left    : true
        },
        {
          src     : host + 'tim_syster.jpg',
          type    : 'image',
          view    : 'portrait',
          width   : 800,
          height  : 1067,
          block   : false,
          left    : true
        }
      ],
      notes : [
        {
          note : 'Well, I\'m pissed an vinigera again, Cause I think that I\'ve lost my best friend'
        }
      ]
    });


    data.push({
      text    : '<p>I am not included within the pale of this glorious anniversary! Your high independence only reveals the immeasurable distance between us. The blessings in which you this day rejoice are not enjoyed in common. The rich inheritance of justice, liberty, prosperity, and independence bequeathed by your fathers is shared by you, not by me. The sunlight that brought life and healing to you has brought stripes and death to me. This Fourth of July is yours, not mine. Youmay rejoice, I must mourn. To drag a man in fetters into the grand illuminated temple of liberty, and call upon him to join you in joyous anthems, were inhuman mockery and sacrilegious irony. Do you mean, citizens, to mock me, by asking me to speak today?</p>',
      author  : 'Frederick Douglass',
      date    : 'July 5, 1852',
      header  : 'What to the Slave is the Fourth of July?',
      extract : 'What to the Slave is the Fourth of July?',
      media   : [{
          src     : host + 'IMG_20150714_190544_1.jpg',
          type    : 'image',
          view    : 'portrait',
          width   : 800,
          height  : 1092
      }]
    });

    data.push({
      text    : '<p>The battle, sir, is not to the strong alone; it is to the vigilant, the active, the brave. Besides, sir, we have no election. If we were base enough to desire it, it is now too late to retire from the contest. There is no retreat but in submission and slavery! Our chains are forged! Their clanking may be heard on the plains of Boston! The war is inevitable — and let it come! I repeat it, sir, let it come!</p><p>It is in vain, sir, to extenuate the matter. Gentlemen may cry, “Peace! Peace!” — but there is no peace. The war is actually begun! The next gale that sweeps from the north will bring to our ears the clash of resounding arms! Our brethren are already in the field! Why stand we here idle? What is it that gentlemen wish? What would they have? Is life so dear, or peace so sweet, as to be purchased at the price of chains and slavery? Forbid it, Almighty God! I know not what course others may take; but as for me, give me liberty, or give me death!</p>',
      author  : 'Patrick Henry',
      date    : 'March 23, 1775',
      header  : '...but as for me, give me liberty, or give me death!',
      extract : 'Is life so dear, or peace so sweet, as to be purchased at the price of chains and slavery? Forbid it, Almighty God! I know not what course others may take; but as for me, give me liberty, or give me death!',
      media   : [{
        src     : host + 'byrum.jpg',
        type    : 'image',
        view    : 'portrait',
        width   : 800,
        height  : 1092,
        block   : false,
        left    : false
      }]
    });

    data.push({
      text    : '<p>I wish, O conscript fathers, to be merciful; I wish not to appear negligent amid such danger to the state; but I do now accuse myself of remissness and culpable inactivity. A camp is pitched in Italy, at the entrance of Etruria, in hostility to the republic; the number of the enemy increases every day; and yet the general of that camp, the leader of those enemies, we see within the walls-aye, and even in the senate-planning every day some internal injury to the republic. If, O Catiline, I should now order you to be arrested, to be put to death, I should, I suppose, have to fear lest all good men should say that I had acted tardily, rather than that any one should affirm that I acted cruelly. But yet this, which ought to have been done long since, I have good reason for not doing as yet; I will put you to death, then, when there shall be not one person possible to be found so wicked, so abandoned, so like yourself, as not to allow that it has been rightly done. As long as one person exists who can dare to defend you, you shall live; but you shall live as you do now, surrounded by my many and trusty guards, so that you shall not be able to stir one finger against the republic; many eyes and ears shall still observe and watch you, as they have hitherto done, tho you shall not perceive them.</p>',
      author  : 'Marcus Tullius Cicero',
      date    : '63 BC',
      header  : 'The First Oration Against Catiline',
      extract : 'The First Oration Against Catiline',
      media   : [{
          src     : host + 'knota.jpg',
          type    : 'image',
          view    : 'portrait',
          width   : 800,
          height  : 1092
      }]
    });



    data.forEach(function(item, i) {
      item.index = i;
      item.even = (i % 2 === 0);
      item.odd = !item.even;
      if (item.headerImage) {
        item.headerImage = addImage(item.headerImage);
      }
      var index = 1;
      var k     = 0;
      while (true) {
        k = item.text.indexOf('{{img}}');
        // console.log('exphbs.precompiled', exphbs.create().precompiled);
        // console.log('exphbs.compiled', exphbs.create().compiled);
        // exphbs.create().getTemplate(global.env.views + 'components/blog/imageLeft.html').then(function(template) {
        //   console.log('template', template(item));
        // });
        if (k < 0) {
          break;
        }
        item.text = item.text.substring(0, k) + addImage(item.media[index]) + item.text.substring(k + 7);
        index++;
      }
    });


    pane = req.params.pane || 'blog';
    pane = pane.toLowerCase();

    r(req, res, {
      pane  : pane,
      posts : data,
      now   : now
    });
  });

};