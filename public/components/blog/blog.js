'use strict';

window.consi = window.consi || {};
window.consi.blog = window.consi.blog || {};

(function(consi) {
  var c = window.consi.blog;
  c.articles = Array.prototype.slice.call(document.querySelectorAll('[data-article]'), 0);
  c.initHeight = c.articles[0].offsetHeight;

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
  }

  function setActiveHeight(article, isResize) {
    var elem;
    if (isResize) {
      consi.mainElem.classList.add('no-transition');
    }
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
    article.style.height = elem.children[0].offsetHeight + 'px';
    if (isResize) {
      /*ignore jslint start*/
      consi.mainElem.offsetHeight;
      /*ignore jslint end*/
      consi.mainElem.classList.remove('no-transition');
    }
  }


  function initFlipper(article) {
    article.addEventListener('click', function() {
      var back = this.querySelector('.back');
      var doc;
      if (!back.classList.contains('init')) {
        setTimeout(function() {
          consi.loadBackgroundImages(back);
        }, 400);
        back.classList.add('init');
      }
      setActiveHeight(this);
      if (this.classList.contains('active')) {
        this.classList.remove('active');
        if (c.currentScrollTop !== undefined) {
          document.getElementById('top-indicator').style.top = (c.currentScrollTop - 20) + 'px';
          smoothScroll.animateScroll( null, '#top-indicator' );
        }
      } else {
        doc = document.documentElement;
        c.currentScrollTop = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);
        this.classList.add('active');
      }
    }, false);
  }


  function initFlippers(articles) {
    var i         = 0;
    var len       = articles.length;
    for (i = 0; i < len; i++) {
      initFlipper(articles[i]);
    }
  }

  c.init = function init(elem) {
    var fronts = elem.querySelectorAll('.front');
    initFlippers(c.articles);
    PubSub.subscribe( consi.events.RESIZE , function() {
      consi.each(c.articles, function(article) {
        setActiveHeight(article, true);
      });
    });
    [].forEach.call(fronts, function(front) {
      consi.loadBackgroundImages(front);
      front.classList.add('init');
    });
    PubSub.subscribe( consi.events.CHARACTER_ESCAPE , function() {
      if ( consi.activeTab !== 'blog' ) {
        return;
      }
      var activeArticles = consi.mainElem.querySelectorAll( 'article.active' );
      var i = 0;
      var len = activeArticles.length;
      for ( i = 0; i < len; i++ ) {
        setActiveHeight( activeArticles[i] );
        activeArticles[i].classList.remove( 'active' );
      }
    });
  };

}(window.consi));