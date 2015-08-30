'use strict';

window.consi = window.consi || {};
window.consi.blog = {};

(function(consi) {
  var c = window.consi.blog;
  c.init = function init(elem) {
    consi.loadBackgroundImages(elem);
  };
}(window.consi));