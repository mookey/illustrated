'use strict';

window.consi = window.consi || {};
window.consi.cv = window.consi.cv || {};

(function(consi) {
  var c = window.consi.cv;
  var highlightedElems;


  function inactivateHighlight(el) {
    el.classList.add('inactive');
  }

  function addHighlight(el) {
    el.classList.add('active');
    el.classList.remove('inactive');
  }

  function removeHighlight(el) {
    el.classList.remove('active');
    el.classList.remove('inactive');
  }
  function removeAllHighlight() {
    highlightedElems.forEach(function(item) {
      removeHighlight(item);
    });
  }

  function inactivateAllHighlight() {
    highlightedElems.forEach(function(item) {
      inactivateHighlight(item);
    });
  }

  function getState() {
    return JSON.parse(window.localStorage.getItem('cv')) || {};
  }

  function setState(o) {
    window.localStorage.setItem('cv', JSON.stringify(o));
  }

  function addHighlightHover() {
    highlightedElems = Array.prototype.slice.call(c.elem.querySelectorAll('.highlight'));
    highlightedElems.forEach(function(item) {
      item.addEventListener('mouseenter', function() {
        inactivateAllHighlight(highlightedElems);
        addHighlight(this);
      }, false);
      item.addEventListener('mouseleave', function() {
        removeAllHighlight(highlightedElems);
      }, false);
    });
  }

  function showIntro() {
    var elems   = getElems();
    var widths  = getWidths(elems);
    showLineAnimation(elems, widths);
    setTimeout(function() {
      showCube(elems, widths);
      hideLine(elems, widths);
    }, 2000);
  }

  function getElems() {
    var animContainer = c.elem.querySelector('.animation-container');
    var line          = animContainer.querySelector('.cube-line');
    var cube          = animContainer.querySelector('.cube');
    var path          = line.querySelector('path');
    return {
      animContainer : animContainer,
      line          : line,
      cube          : cube,
      path          : path
    }
  }

  function showCube(elems, widths) {
    var cube  = elems.cube;
    var z     = widths.w;
    cube.style.width  = widths.w + 'px';
    cube.style.height = widths.h + 'px';
    cube.style.transformOrigin  = (widths.w / 2) + 'px 0 -' + (widths.w / 2) + 'px';
    cube.parentNode.style.perspectiveOrigin = (widths.w / 2) + 'px ' + (widths.h / 2) + 'px';

    cube.querySelector('.cube-front').style.transform  = 'translate3d(0, 0, 0)rotateY(0deg)';
    cube.querySelector('.cube-back').style.transform   = 'translate3d(' + z + 'px, 0, -' + z + 'px)rotateY(180deg)';
    cube.querySelector('.cube-right').style.transform  = 'translate3d(' + z + 'px, 0, 0)rotateY(90deg)';
    cube.querySelector('.cube-left').style.transform   = 'translate3d(0, 0, -' + z + 'px)rotateY(-90deg)';
    cube.classList.remove('hide');
    setTimeout(function() {
      cube.classList.add('transparent');
    }, 200);

    setTimeout(function() {
      cube.style.transform        = 'translate3d(0, 0 ,-' + (widths.w) + 'px)';
    }, 1000);

    setTimeout(function() {
      cube.style.transform        = 'translate3d(0, 0 ,-' + (widths.w) + 'px)rotateY(180deg)';
    }, 1700);

    setTimeout(function() {
      cube.style.transform        = 'translate3d(0, 0 , 0)rotateY(180deg)';
    }, 2400);

    setTimeout(function() {
      cube.classList.remove('transparent');
      consi.loadBackgroundImages(c.elem);
      cube.classList.add('hide');
    }, 3000);
  }

  function getWidths(elems) {
    var w = elems.animContainer.offsetWidth;
    var h = elems.animContainer.offsetHeight;
    return {
      w : w,
      h : h
    }
  }

  function hideLine(elems) {
    elems.line.classList.add('hide');
  }

  function showLineAnimation(elems, widths) {
    var animContainer = elems.animContainer;
    var line          = elems.line;
    var cube          = elems.cube;
    var path          = elems.path;
    var w             = widths.w;
    var h             = widths.h;
    var path;
    var totalLength;
    line.setAttribute('width'   , w);
    line.setAttribute('height'  , h);
    path                        = line.querySelector('path');
    path.style.transition       = 'none';
    path.setAttribute('d',      'M0,0 L' + w + ',0 L' + w + ',' + h + ' L0,' + h + ' Z');
    totalLength                 = path.getTotalLength();
    path.style.strokeDasharray  = totalLength + ' ' + totalLength;
    path.style.strokeDashoffset = totalLength;
    path.getBoundingClientRect();
    path.style.transition       = 'stroke-dashoffset 2s ease-in-out';
    path.style.strokeDashoffset = '0';
  }

  c.init = function init(elem) {
    var state;
    var delay = 0;
    c.elem = elem;
    showIntro();

    if (consi.root.classList.contains('keyboard')) {
      setTimeout(function() {
        addHighlightHover();
      }, 800);
    }

  };

}(window.consi));