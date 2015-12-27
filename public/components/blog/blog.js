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

  function initFlipper( article ) {
    var front = article.querySelector( '.front' );
    article.classList.remove('dynamic');
    consi.loadBackgroundImages( front );
    front.classList.add( 'init' );

    article.addEventListener('click', function( ev ) {
      ev.preventDefault();
      onTrigger( this );
    }, false);

    Array.prototype.slice.call(article.querySelectorAll('.no-op'), 0).forEach(function( noOp ) {
      noOp.addEventListener('click', function( ev ) {
        ev.preventDefault();
      });
    });
  }

  function onTrigger( article ) {
      var back = article.querySelector('.back');
      if (!back.classList.contains('init')) {
        setTimeout(function() {
          consi.loadBackgroundImages(back);
        }, 400);
        back.classList.add('init');
      }
      setActiveHeight( article );
      article.classList.toggle('active');
  }

  function initFlippers(articles) {
    var i         = 0;
    var len       = articles.length;
    for (i = 0; i < len; i++) {
      initFlipper(articles[i]);
    }
  }

  function getArticles() {
    var url = c.articles[c.articles.length - 1].getAttribute('data-next-url');
    consi.doRequest({
      type : 'get',
      url  : url
    }, function( data ) {

      var posts = JSON.parse( data );
      if ( !posts.length ) {
        c.isRequesting   = false;
        PubSub.unsubscribe( c.tokens.SCROLL );
        return;
      }

      var div     = document.createElement('div');
      var html    = '';
      var wrapper = consi.mainElem.querySelector( '.blog-wrapper' );
      var newArticles;

      posts.forEach( function( postData ) {
        html += Handlebars.partials['blog/post']( postData );
      });
      div.innerHTML = html;

      newArticles = div.querySelectorAll('[data-article]');
      var i = 0;
      var len = newArticles.length;
      for ( i = 0; i < len; i++ ) {
        wrapper.appendChild( newArticles[ i ] );
        initFlipper(newArticles[ i ]);
      }

      newArticles = Array.prototype.slice.call( newArticles, 0);
      c.articles = c.articles.concat( newArticles );
      c.isRequesting = false;
    });
  }

  c.init = function init( elem ) {

    initFlippers( c.articles );
    updateViewportHeight();
    c.tokens = {};

    c.tokens.RESIZE = PubSub.subscribe( consi.events.RESIZE , function() {
      updateViewportHeight();
      consi.each( c.articles, function( article ) {
        setActiveHeight( article, true );
      });
    });

    c.tokens.CHARACTER_ESCAPE = PubSub.subscribe( consi.events.CHARACTER_ESCAPE , function() {
      if ( consi.activeTab !== 'blog' ) {
        return;
      }
      var activeArticles = consi.mainElem.querySelectorAll( 'article.active' );
      var i              = 0;
      var len            = activeArticles.length;
      for ( i = 0; i < len; i++ ) {
        onTrigger( activeArticles[i] );
      }
    });

    c.tokens.FLIPPER_SWIPE = PubSub.subscribe( consi.events.FLIPPER_SWIPE, function( ev, article ) {
      onTrigger( article );
    });

    c.tokens.SCROLL = PubSub.subscribe( consi.events.SCROLL, function( ev ) {
      var earliestArticle;

      if ( c.isRequesting ) {
        return;
      }

      earliestArticle = c.articles[c.articles.length - 1];
      if ( earliestArticle.getBoundingClientRect().bottom > ( 100 + c.viewportHeight) ) {
        return;
      }

      c.isRequesting  = true;

      if ( c.hasRequestedTemplates ) {
        getArticles();
        return;
      }

      var templatesUrl = consi.mainElem.getAttribute('data-templates');

      basket
        .require({ url: templatesUrl, key: 'templates', skipCache: true })
        .then(function () {
          Object.keys( Handlebars.partials ).forEach( function( key ) {
            var name = key.split('.')[0];
            Handlebars.partials[ 'blog/' + name ] = Handlebars.partials[ key ];
          });
          c.hasRequestedTemplates = true;
          getArticles();
        });

    });

  };

}(window.consi));