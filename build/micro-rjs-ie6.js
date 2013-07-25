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
/*
 * @package Micro-RequireJs
 * @author sheiko
 * @license MIT
 * @copyright (c) Dmitry Sheiko http://www.dsheiko.com
 * @jscs standard:Jquery
 * Code style: http://docs.jquery.com/JQuery_Core_Style_Guidelines
 */
var rjs = (function( global, exports ) {
    "use strict";
    var document = global.document,
        /**
         * Subscribe to a document event helper
         * @param {string} eventName
         * @param {function} fn
         */
        onDocumentEvent = function( eventName, fn ) {
          var elem = document;
          // W3C DOM
          if ( elem.addEventListener )  {
              elem.addEventListener( eventName, fn, false );
          } else {
            // IE DOM
            if ( elem.attachEvent ) {
              return elem.attachEvent( "on" + eventName, fn );
            } else {
              throw new Error( "Cannot subscribe to the event" + eventName );
            }
          }
        },
        /**
         * Event Mediator
         * @module
         */
        eventHub = (function() {
          var eventListeners = [],
              eventStack = [];
          return {
            /**
             * Traverse the list of listenters and call the specified handlers when all
             * the event the listener subsscribed for already fired
             */
            resolveListeners: function() {
              eventListeners.forEach(function( listener ) {
                if ( listener.events.every( function( eventName ){
                  return eventStack.indexOf( eventName ) !== -1;
                })) {
                  listener.handler();
                }
              });
            },
            /**
             * Fire event
             * @param {string} eventName
             */
            fire: function( eventName ) {
              eventStack.push( eventName );
              this.resolveListeners();
            },
            /**
             * Subscribe a handler for a set of events
             * @param {array} events
             * @param {function} handler
             */
            listen: function( events, handler ) {
              if ( !Array.isArray( events ) ) {
                 throw new TypeError("The first parameter must an array");
              }
              if ( typeof handler !== "function" ) {
                throw new TypeError("The second parameter must a function");
              }
              eventListeners.push({ "events": events, "handler": handler });
            },
            /**
             * Reset internal arrays to get a clear env while unit-testing
             */
            reset: function() {
              eventListeners = [];
              eventStack = [];
            }
          };
        }());


  return (function() {
    // Register DOMContentLoaded event
    onDocumentEvent( "DOMContentLoaded", function() {
      eventHub.fire("DOMContentLoaded");
    });
    return {
      /**
       * Load a given script asynchronously and fires event <dependency>-load
       * when script is loaded and both DOM are ready and script is loaded
       *
       * @param {string} file - dependency script path
       * @param {string} dependency - dependency name
       * @param {function) completeFn OPTIONAL - A callback function
       *      that is executed when the request completes.
       */
      define: function( file, dependency, completeFn ) {
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = file;
        script.async = true;
        document.body.appendChild( script );
        script.onreadystatechange =
          script.onload = function() {
          var eventName = dependency + "-loaded";
          eventHub.fire( eventName );
          completeFn && completeFn();
        };
      },
      /**
       * Call the function fn when all supplied events fired
       *
       * @param {array} dependencies
       * @param {function} cb - callback function that is executed
       *  when all the supplied dependencies resolved
       */
      require: function( events, cb ) {
        eventHub.listen( events, cb );
        eventHub.resolveListeners();
      },
      /**
       * Reset internal arrays to get a clear env while unit-testing
       */
      reset: function() {
        eventHub.reset();
      }
    };
  }());

}( this ));
