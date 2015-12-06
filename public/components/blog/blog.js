'use strict';

window.consi = window.consi || {};
window.consi.blog = window.consi.blog || {};

(function(consi) {
  var c = window.consi.blog;
  c.articles = Array.prototype.slice.call(document.querySelectorAll('[data-article]'), 0);

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

  function updateViewportHeight() {
    c.viewportHeight = (window.innerHeight || document.documentElement.clientHeight);
  }

  function initFlipper(article) {
    article.addEventListener('click', function() {
      onTrigger( this );
    }, false);
  }

  function onTrigger( article ) {
      var back = article.querySelector('.back');
      var doc;
      if (!back.classList.contains('init')) {
        setTimeout(function() {
          consi.loadBackgroundImages(back);
        }, 400);
        back.classList.add('init');
      }
      setActiveHeight( article );
      if (article.classList.contains('active')) {
        article.classList.remove('active');
        // if (c.currentScrollTop !== undefined) {
        //   document.getElementById('top-indicator').style.top = c.currentScrollTop + 'px';
        //   smoothScroll.animateScroll( null, '#top-indicator' );
        // }
      } else {
        // doc = document.documentElement;
        // c.currentScrollTop = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);
        article.classList.add('active');
      }

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

    updateViewportHeight();

    PubSub.subscribe( consi.events.RESIZE , function() {
      consi.each(c.articles, function(article) {
        setActiveHeight(article, true);
        updateViewportHeight();
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
        onTrigger( activeArticles[i] );
      }
    });

    PubSub.subscribe( consi.events.FLIPPER_SWIPE, function( ev, article ) {
      onTrigger( article );
    });

    PubSub.subscribe( consi.events.SCROLL, function( ev ) {
      return;
      var earliestArticle = c.articles[c.articles.length - 1];
      var bottom = earliestArticle.getBoundingClientRect().bottom;
      var url = earliestArticle.getAttribute('data-next-url');
      if ( c.isRequesting ) {
        return;
      }
      console.log('isRequesting', c.isRequesting)
      console.log('bottom', bottom);
      console.log('c.viewportHeight', c.viewportHeight);
      if (bottom < c.viewportHeight ) {
        c.isRequesting = true;
        if ( c.hasRequestedTemplates ) {
          consi.doRequest({
            type : 'get',
            url  : url
          }, function( data ) {
            console.log( Handlebars.partials.posts( data ) );
            Handlebars.partials.posts( data );
            // c.isRequesting = false;
          });
        } else {
          c.hasRequestedTemplates = true;
          basket
            .require({ url: './assets/scripts/templates.js', key: 'templates', skipCache: true })
            .then(function () {
              consi.doRequest({
                type : 'get',
                url  : url
              }, function( data ) {
                // console.log( Handlebars.partials.post({}) );
                // console.log( Handlebars.partials.posts( data ) );
                var div = document.createElement('div');
                var posts = JSON.parse( data );
                var html = '';

                posts.forEach( function( postData ) {
                  console.log( postData )
                  html += Handlebars.partials['blog/post']( postData );
                });
                div.innerHTML = html;
                console.log( div );
                // c.isRequesting = false;
              });
            });
        }
      }
    });

  };

}(window.consi));