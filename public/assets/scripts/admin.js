this.admin = this.admin || {};


(function(c) {
  'use strict';
  var consi = c;

  function load() {
    var forms = document.querySelectorAll('form');
    var i = 0;
    var len = forms.length;
    var form;
    for ( i = 0; i < len; i++ ) {
      form = forms[i];
      form.addEventListener('submit', function( ev ) {

        ev.preventDefault();

        var oData = new FormData(this);
        var statusElem = document.querySelector('.status');

        oData.append('username', document.getElementsByName('username')[0].value);
        oData.append('password', document.getElementsByName('password')[0].value);

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


      }, false);
    }
    var selects = document.querySelectorAll( 'select' );
    i = 0;
    len = selects.length;
    for ( i = 0; i < len; i++) {
      addSelectListener( selects[i] );
    }
  }

  function getParentByClass( element, cls ) {
    while ( element ) {
      if ( element.classList && element.classList.contains( cls ) ) {
        return element;
      }
      element = element.parentNode;
    }
    return false;
  };

  function addSelectListener( elem ) {
    elem.addEventListener( 'change', function( ev ) {
      var form = getParentByClass( this, 'media' );
      var hideSelector;
      var showSelector;
      var elementsToHide;
      var elementsToShow;
      if ( this.value === 'video') {
        hideSelector = '.image', '.youtube';
        showSelector = '.video';
      } else if ( this.value === 'image') {
        hideSelector = '.video, .youtube';
        showSelector = '.image';
      } else {
        hideSelector = '.video, .image';
        showSelector = '.youtube';
      }
      elementsToHide = Array.prototype.slice.call( form.querySelectorAll( hideSelector ), 0);
      elementsToHide.forEach( function( el ) {
        el.classList.add( 'hide' );
      });
      elementsToShow = Array.prototype.slice.call( form.querySelectorAll( showSelector ), 0);
      elementsToShow.forEach( function( el ) {
        el.classList.remove( 'hide' );
      });
    }, false)
  }


  document.addEventListener("DOMContentLoaded", load, false);
})(this.admin);

