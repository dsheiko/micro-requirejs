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
