this.consi = this.consi || {};

(function(c) {
  'use strict';
  var consi = c;

  function load() {
    basket
    .require(
      { url: 'https://cdnjs.cloudflare.com/ajax/libs/pubsub-js/1.5.2/pubsub.min.js', key: 'PubSub', unique: '1' },
      { url: 'https://cdnjs.cloudflare.com/ajax/libs/smooth-scroll/7.1.0/js/smooth-scroll.min.js', key: 'scroll', unique: '1' }
    )
    .then(function () {
      smoothScroll.init();
      init();
    });

    consi.events = {
      'RESIZE' : 0
    };

  }


  function init() {

    var supportsOrientationChange;
    var orientationEvent;
    var activeClass;
    var root                  = document.documentElement;
    consi.isMoving            = true;
    document.body.scrollTop   = root.scrollTop = 0;
    consi.mainElem            = document.getElementById('main');
    consi.navLinks            = Array.prototype.slice.call(document.querySelectorAll('[data-nav-link]'), 0);
    supportsOrientationChange = !!window.onorientationchange;
    orientationEvent          = supportsOrientationChange ? "orientationchange" : "resize";

    consi.each(consi.navLinks, function(link) {
      link.addEventListener('click', function(ev) {
        var cls = this.getAttribute('data-nav-link');
        var currentClass;
        ev.preventDefault();
        currentClass = consi.getActiveClass();

        if (consi.activeClassMappings[currentClass] === consi.activeClassMappings[cls]) {
          return;
        }

        if (consi.activeClassMappings[currentClass] > consi.activeClassMappings[cls]) {
          consi.moveLeft();
        } else {
          consi.moveRight();
        }

      }, false);
    });


    if (consi.isTouchDevice()) {
      root.classList.add('touch');
      basket
        .require({ url: 'https://cdnjs.cloudflare.com/ajax/libs/hammer.js/2.0.4/hammer.min.js', key: 'Hammer', unique: '1' })
        .then(function () {
          var mc = new Hammer(consi.mainElem, { threshold: 100 });
          mc.on("swipeleft swiperight", function(ev) {
            if (ev.type === 'swipeleft') {
              consi.moveRight();
              return;
            }
            consi.moveLeft();
          });
        });
    } else {
      root.classList.add('keyboard');
      window.addEventListener('keydown', function(ev){
        var key         = ev.keyCode;
        if (key === 37) {
          consi.moveLeft();
          return;
        }
        if (key === 39) {
          consi.moveRight();
          return;
        }
      }, false);
    }


    window.addEventListener(orientationEvent, function() {
      PubSub.publish( consi.events.RESIZE );
    }, false);

    activeClass = consi.getActiveClass();

    setTimeout(function() {
      document.querySelector('.top').classList.add('initialized');
      consi.each(consi.mainElem.querySelectorAll('.no-op'), function(noop) {
        noop.addEventListener('click', function(ev) {
          ev.preventDefault();
        }, false);
      });
    }, 100);
    setTimeout(function() {
      consi.mainElem.classList.add('initialized');
    }, 800);
    setTimeout(function() {
        consi.mainElem.classList.add('dropped');
        consi.initiateComponent(activeClass);
        consi.isMoving = false;
    }, 1600);
  }

  consi.each = function(arr, cb) {
    var i   = 0;
    var len = arr.length;
    for (i = 0; i < len; i++) {
      cb(arr[i]);
    }
  };


  consi.moveLeft = function() {
    var activeClass = consi.getActiveClass();
    var index       = consi.activeClassMappings[activeClass];
    if (index === 0) {
      return;
    }
    setScrollOffset(activeClass);
    index--;
    consi.move(index);
  };

  consi.moveRight = function() {
    var activeClass = consi.getActiveClass();
    var index       = consi.activeClassMappings[activeClass];
    if (index >= (consi.navLinks.length - 1)) {
      return;
    }
    setScrollOffset(activeClass);
    index++;
    consi.move(index);
  };

  function setScrollOffset(cls) {
    var doc = document.documentElement;
    consi[cls].scrollTop = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);
  }



  consi.move = function(index) {
    var cls;
    if (consi.isMoving) {
      return;
    }
    consi.isMoving = true;
    cls = consi.getMappingByIndex(index);
    consi.removeActiveClass();
    consi.setActiveClass(cls);
    consi.initiateComponent(cls);
    setTimeout(function() {
      consi.isMoving = false;
      document.getElementById('top-indicator').style.top = ((consi[cls].scrollTop || 0) - 20) + 'px';
      smoothScroll.animateScroll( null, '#top-indicator' );
    }, 610);
    //
    // setTimeout(function() {
    //   smoothScroll.animateScroll( null, '#main' );
    // }, 300);
  };


  consi.initiateComponent = function(activeClass) {
    var component = consi.mainElem.querySelector('.wrapper-inner[data-component="' + activeClass + '"]');
    var transitionTimer = 600;
    var then = (new Date()).getTime();
    var script;
    if (!component) {
      return;
    }
    if (component.classList.contains('init')) {
      return;
    }
    script = component.getAttribute('data-script');

    if (!script) {
      component.classList.add('init');
      return;
    }

    basket
      .require({ url: script, key: activeClass, skipCache: true })
      .then(function () {
        var now = (new Date()).getTime();

        if ((now - then) > transitionTimer) {
          window.consi[activeClass].init(component);
        } else {
          setTimeout(function() {
            window.consi[activeClass].init(component);
          }, transitionTimer - (now - then));
        }
      });

    component.classList.add('init');
  };


  consi.activeClassMappings = {
    'blog'    : 0,
    'cv'      : 1,
    'oland'   : 2,
    'm'       : 3
  };

  consi.getMappingByIndex = function getMappingByIndex(index) {
    var cls;
    Object.keys(consi.activeClassMappings).forEach(function(key) {
      if (index === consi.activeClassMappings[key]) {
        cls = key;
      }
    });
    return cls;
  };

  consi.getActiveClass = function getActiveClass() {
    return consi.mainElem.getAttribute('data-active-class');
  };

  consi.setActiveClass = function setActiveClass(cls) {
    consi.mainElem.classList.add(cls);
    consi.mainElem.querySelector('[data-nav-link="' + cls + '"]').classList.add('active');
    consi.mainElem.setAttribute('data-active-class', cls);
    window.history.replaceState({ url : cls }, '', '/' + cls);
  };

  consi.removeActiveClass = function removeActiveClass() {
    Object.keys(consi.activeClassMappings).forEach(function(key) {
      consi.mainElem.classList.remove(key);
    });
    consi.each(consi.navLinks, function(el) {
      el.classList.remove('active');
    });
    consi.mainElem.setAttribute('data-active-class', '');
  };



  consi.isTouchDevice = function() {
    return !!('ontouchstart' in window) || 'onmsgesturechange' in window;
  };


  consi.loadBackgroundImages = function(element) {
    var c           = element || document;
    var imageElems  = c.querySelectorAll('[data-image-src]');
    var i       = 0;
    var len     = imageElems.length;
    var imageElem;
    for (i = 0; i < len; i++) {
      imageElem = imageElems[i];
      (function(elem) {
        var image;
        var src;
        src = elem.getAttribute('data-image-src');
        if (!src) {
          elem.classList.add('hide');
          return;
        }
        image = new Image();
        image.onload = function() {
          elem.style.backgroundImage = 'url("' + src + '")';
          elem.offsetWidth;
          elem.classList.remove('invisible');
        };
        image.src = src;
      })(imageElem);
    }
  }

  document.addEventListener("DOMContentLoaded", load, false);
})(this.consi);

