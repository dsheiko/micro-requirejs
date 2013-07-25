/*
 * Support for browsers released before November 2005 (e.g. IE < 9)
 * @package Micro-RequireJs
 * @author https://developer.mozilla.org/en-US/
  * @jscs standard:Jquery
 * Code style: http://docs.jquery.com/JQuery_Core_Style_Guidelines
 */

(function( global ){
  "use strict";
 /**
  * Array.prototype.forEach workaround
  * Natively implemented in JavaScript 1.6
  */
 if ( !Array.prototype.forEach ) {
   Array.prototype.forEach = function( fn, scope ) {
     var i = 0,
         len = this.length;
     for ( ; i < len; ++i ) {
       if ( i in this ) {
         fn.call( scope || global, this[i], i, this );
       }
     }
   };
 }
 /**
  * Array.prototype.every workaround
  * Natively implemented in JavaScript 1.6
  */
  if ( !Array.prototype.every )
  {
    Array.prototype.every = function( fun /*, thisp */)
    {
      var t, len, thisp, i = 0;
      if  ( this === null ) {
        throw new TypeError();
      }
      t = Object( this );
      len = t.length >>> 0;
      if ( typeof fun !== "function" ) {
        throw new TypeError();
      }
      thisp = arguments[ 1 ];
      for ( ; i < len; i++ ) {
        if ( i in t && !fun.call( thisp, t[ i ], i, t ) ) {
          return false;
        }
      }
      return true;
    };
  }
 /**
  * Array.prototype.indexOf workaround
  * Natively implemented in JavaScript 1.6
  */
  if ( !Array.prototype.indexOf ) {
    Array.prototype.indexOf = function ( searchElement /*, fromIndex */) {
      var t, len, n = 0, k;
      if ( this === null ) {
        throw new TypeError();
      }
      t = Object( this );
      len = t.length >>> 0;
      if ( len === 0 ) {
        return -1;
      }
      if ( arguments.length > 1 ) {
        n = Number(arguments[ 1 ]);
        if ( n != n ) { // shortcut for verifying if it's NaN
          n = 0;
        } else if ( n !== 0 && n !== Infinity && n !== -Infinity ) {
          n = ( n > 0 || -1 ) * Math.floor( Math.abs( n ) );
        }
      }
      if ( n >= len ) {
        return -1;
      }
      k = n >= 0 ? n : Math.max( len - Math.abs( n ), 0 );
      for ( ; k < len; k++ ) {
        if ( k in t && t[ k ] === searchElement ) {
          return k;
        }
      }
      return -1;
    };
  }

  /**
   * Array.isArray workaround
   * Natively implemented in JavaScript 1.8.5 (July 27, 2010)
   */
  if( !Array.isArray ) {
    Array.isArray = function ( vArg ) {
      return Object.prototype.toString.call( vArg ) === "[object Array]";
    };
  }

}( this ));