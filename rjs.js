/*
 * @package Micro-RequireJs
 * @author sheiko
 * @license MIT
 * @copyright (c) Dmitry Sheiko http://www.dsheiko.com
 */
 
window.rjs = (function( window, undefined ) {
  "use strict";

  var loadStrategy = {
    js: function( src ) {
      var el = document.createElement( "script" );
      el.src = src;
      el.async = true;
      return el;
    },
    css: function ( src ) {
      var el = document.createElement( "link" );
      el.type = "text/css";
      el.rel = "stylesheet";
      el.href = src;
      return el;
    }
  };
  /**
   * Load resource
   * @param {String} src 
   * @param {Object} [options]
   */
  function load( src, options ) {    
    return new Promise(function ( resolve, reject ) { 
        var ext = src.split( "." ).pop().toLowerCase();  
        if ( !( ext in loadStrategy ) ) {
          throw new Error( "Invalid file extension in ", src );
        }
        var el = loadStrategy[ ext ]( src );
        el.onload = resolve;
        el.onerror = reject;
        options && Object.keys( options ).forEach(function( key ){
          el.setAttribute( key, options[ key ] );
        });
        document.head.appendChild( el );
    });
  }
  /**
   * @param {String|Array} src
   * @param {Object} [options]
   */
  return function() {
    var args = arguments;
    if ( typeof args[ 0 ] === "string" ) {
      return load.apply( null, args );
    }

    return Promise.all( args[ 0 ].map(function( src ){
      if ( typeof src === "string" ) {
        return load( src );
      }      
      return load.apply( null, src );
    }) );
  }

}( this ));
