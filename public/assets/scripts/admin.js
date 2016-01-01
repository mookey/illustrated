this.admin = this.admin || {};


(function(c) {
  'use strict';
  var consi = c;
  return;

  function load() {
    var forms = document.querySelectorAll('form');
    var i = 0;
    var len = forms.length;
    var form;
    for ( i = 0; i < len; i++ ) {
      form = forms[i];
      form.addEventListener('submit', function(ev) {

        var oData = new FormData(this);
        var statusElem = document.querySelector('.status');

        var oReq = new XMLHttpRequest();
        oReq.open('POST', '/admin', true);
        oReq.onload = function(oEvent) {
          if (oReq.status == 200) {
            statusElem.innerHTML = "Done!";
          } else {
            statusElem.innerHTML = "Error " + oReq.status;
          }
          statusElem.classList.remove('hide');
        };

        oReq.send(oData);
        ev.preventDefault();

      }, false);
    }
  }


  document.addEventListener("DOMContentLoaded", load, false);
})(this.admin);
