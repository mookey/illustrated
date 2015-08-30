'use strict';

window.consi = window.consi || {};
window.consi.cv = {};

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

  c.init = function init(elem) {
    c.elem = elem;
    if (consi.isTouchDevice()) {
      consi.loadBackgroundImages(elem);
      return;
    }
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
    consi.loadBackgroundImages(elem);
  };

}(window.consi));