'use strict';

window.consi = window.consi || {};
window.consi.blog = {};

(function(consi) {
  var c = window.consi.blog;
  c.articles = Array.prototype.slice.call(document.querySelectorAll('[data-article]'), 0);
  c.placeholderElem = document.querySelector('.placeholder').children[0];

  c.init = function init(elem) {
    var fronts = elem.querySelectorAll('.front');
    [].forEach.call(fronts, function(front) {
      consi.loadBackgroundImages(front);
      front.classList.add('init');
    });
  };


  initFlippers(c.articles);
  initFaders(c.articles);
  PubSub.subscribe( consi.events.RESIZE , function() {
    consi.each(c.articles, function(article) {
      setActiveHeight(article, true);
    });
  });

  function initFaders(articles) {
    consi.each(articles, function(elem) {
      elem.addEventListener('mouseenter', function() {
        consi.each(c.articles, function(el) {
          el.classList.add('faded');
        });
        elem.classList.remove('faded');
      }, false);
      elem.addEventListener('mouseleave', function() {
        consi.each(c.articles, function(el) {
          el.classList.remove('faded');
      });
      }, false);

    });
  };

  function initFlipper(article) {
    article.addEventListener('click', function() {
      var back = this.querySelector('.back');
      if (!back.classList.contains('init')) {
        setTimeout(function() {
          consi.loadBackgroundImages(back);
        }, 320);
        back.classList.add('init');
      }
      setActiveHeight(this);
      this.classList.toggle('active');
    }, false);
  }

  function initFlippers(articles) {
    var i         = 0;
    var len       = c.articles.length;
    for (i = 0; i < len; i++) {
      initFlipper(c.articles[i]);
    }
  };

  function setActiveHeight(article, isResize) {
    var self = this;
    var box;
    var elem;
    if (isResize) {
      consi.mainElem.classList.add('no-transition');
    }
    c.placeholderElem.style.width = article.getBoundingClientRect().width + 'px';
    if (article.classList.contains('active')) {
      if (isResize) {
        elem = article.querySelector('.back');
      } else {
        elem = article.querySelector('.front');
      }
    } else {
      if (isResize) {
        elem = article.querySelector('.front');
      } else {
        elem = article.querySelector('.back');
      }
    }
    c.placeholderElem.innerHTML = '';
    c.placeholderElem.appendChild(elem.cloneNode(true));
    box = c.placeholderElem.getBoundingClientRect();
    article.style.height = box.height + 'px';
    if (isResize) {
      /*ignore jslint start*/
      consi.mainElem.offsetHeight;
      /*ignore jslint end*/
      consi.mainElem.classList.remove('no-transition');
    }
  };


}(window.consi));