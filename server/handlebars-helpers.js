'use strict';

module.exports = function(handlebars) {

  handlebars.registerHelper( 'ifEqual', function( a, b, opts ) {
    if ( a === b ) {
      return opts.fn( this );
    } else {
      return opts.inverse( this );
    }
  });

  handlebars.registerHelper('ifEven', function(conditional, options) {
    if((conditional % 2) == 0) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  });

};