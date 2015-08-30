'use strict';

module.exports = function(app) {


  function r(req, res, data) {
    if (req.xhr) {
      res.send(data);
      return;
    }
    res.render('body', data);
  }


  app.get('/:pane?', function (req, res) {
    var data = [];
    var host = 'https://googledrive.com/host/0B6HtzsiMSfisfl9IVHZ2RUYzZ2lzOG53MzNmUUg3clkxWUZLUjBfUjN3eTVHVlBlZ0tVSmM/';
    var pane;


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
          height  : 1092
      }]
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
          src     : host + 'main_man.jpg',
          type    : 'image',
          view    : 'portrait',
          width   : 800,
          height  : 1092
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
    });


    pane = req.params.pane || 'blog';
    pane = pane.toLowerCase();

    r(req, res, {
      pane  : pane,
      posts : data
    });
  });

};