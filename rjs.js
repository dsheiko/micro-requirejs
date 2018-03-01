/*
 * @package Micro-RequireJs
 * @author sheiko
 * @license MIT
 * @copyright (c) Dmitry Sheiko http://www.dsheiko.com
 * @jscs standard:Jquery
 */
window.rjs = (function( window, undefined ) {
    "use strict";


      /**
       * Event Mediator
       * @class
       */
  var EventHub = function() {
        return {
          /**
           * @type {Array}
           */
          eventStack: [],
          /**
           * @type {Array}
           */
          pendingListeners: [],
          /**
           * Reset to intial state
           */
          reset: function() {
            this.eventStack = [];
            this.pendingListeners = [];
          },
          /**
           * If any of pending event sets resolved with the currently triggered event
           * then call the corresponsing handler(s) and remove the sets from pending list
           */
          resolvePendingListeners: function() {
            var that = this;
            this.pendingListeners.forEach(function( entry, inx ){
              if ( entry && that.isEveryEventResolved( entry.events ) ) {
                entry.handler();
                delete that.pendingListeners[ inx ];
              }
            });
          },
          /**
           * Check event set if all the enlisted events resolved already
           * @param {Array} events
           * @returns {Boolean}
           */
          isEveryEventResolved: function( events ) {
            var that = this;
            return events.every(function( eventName ){
              return that.eventStack.indexOf( eventName ) !== -1;
            });
          },
          /**
           * Fire event and check if any pending event sets get resolved with it
           * @param {string} eventName
           */
          trigger: function( eventName ) {
            options.debug && console.log( ">> `" + eventName + "` triggered" );
            this.eventStack.push( eventName );
            this.resolvePendingListeners();
          },

          /**
           * Subscribe a handler for a set of events
           * @param {array} events
           * @param {function} handler
           */
          on: function( events, handler ) {
            options.debug && console.log( ">> `" + window.JSON.stringify( events ) + "` subscribed" );
            if ( !Array.isArray( events ) ) {
               throw new TypeError("The first parameter must an array");
            }
            if ( typeof handler !== "function" ) {
              throw new TypeError("The second parameter must a function");
            }
            // all of enisted events already resolved
            if ( this.isEveryEventResolved( events ) ) {
              return handler();
            }
            // we will fire up the handler in future when all the vents resolved
            this.pendingListeners.push({ "events": events, "handler": handler });
          }
        };
      },
      /**
       * @type {Object}
       */
      options = {
        debug: false
      },

      /**
       * Trim a string
       *
       * @param {string} str
       * @returns {string}
       */
      trim = function ( str ) {
        return str.replace( /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "" );
      },

      /**
       * Build loader element by file name
       *
       * @param {string} file
       * @returns {HTMLElement}
       */
      buildLoaderElement = function( file ) {
        var ext = file.split( "." ).pop().toLowerCase();
        switch ( ext ) {
          case "css":
            return cssStrategy( file );
          case "js":
            return jsStrategy( file );
        }
        throw new Error( "Unknown file extension " + ext );
      },

      /**
       * Create loader element according to CSS strategy
       *
       * @param {string} file
       * @returns {HTMLElement}
       */
      cssStrategy = function( file ){
        var el = window.document.createElement( "link" );
        el.type = "text/css";
        el.rel = "stylesheet";
        el.href = file;
        el.async = true;
        return el;

      },

      /**
       * Create loader element according to JavaScript strategy
       *
       * @param {string} file
       * @returns {HTMLElement}
       */
      jsStrategy = function( file ){
        var el = window.document.createElement( "script" );
        el.type = "text/javascript";
        el.src = file;
        el.async = true;
        return el;
      },

      /**
       * Manages async loaded dependencies
       * @class
       */
      Rjs = function(){
        var eventHub = new EventHub(),
            subscribeDomReady = function(){
              // Register DOM is ready event
              if ( window.document.readyState === "complete" || window.document.readyState === "loaded" ) {
                eventHub.trigger( "DOMContentLoaded" );
              } else {
                window.document.addEventListener( "DOMContentLoaded", function(){
                  eventHub.trigger( "DOMContentLoaded" );
                }, false );
              }
            };
            subscribeDomReady();

        return {
          /**
           * Load a given script asynchronously and fires event <dependency>-load
           * when script is loaded and both DOM are ready and script is loaded
           *
           * @param {string} file - dependency script path
           * @param {string} dependency - dependency name
           * @param {function) doneArg OPTIONAL - A callback function
           *      that is executed when the request completes.
           * @param {Object} [context]
           */
          define: function ( file, dependency, doneArg, context ) {
            var el = buildLoaderElement( trim( file ) ),
                done = context ? doneArg.bind( context ) : doneArg;

            if ( typeof dependency !== "string" ) {
              throw new TypeError( "You have to specify dependency name" );
            }

            // make it seekable
            el.setAttribute( "data-rjs", true );
            window.document.body.appendChild( el );

            if ( el.onload !== undefined ) {
              el.onload = function() {
                eventHub.trigger( dependency );
                done && done();
              };
              return;
            }

            // IE<9
            el.onreadystatechange = function() {
              if ( el.readyState !== "loaded" ) {
                return;
              }
              eventHub.trigger( dependency );
              done && done();
            };
          },

          /**
           * Call the function fn when all supplied events fired
           *
           * @param {Array} events
           * @param {Function} done - callback function that is executed
           *  when all the supplied dependencies resolved
           * @param {Object} [context]
           */
          require: function( events, done, context ) {
            if ( context ) {
              done = done.bind( context );
            }
            eventHub.on( events, done );
          },

          /**
           * Set options
           * @param {Object} [opts]
           */
          init: function( opts ) {
            options = opts || { debug: false };
            eventHub.reset();
            subscribeDomReady();
          },

          /**
           * Remove from DOM any assets loaded by RJS
           */
          reset: function() {
            var scripts = document.querySelectorAll( "script[data-rjs]" ),
                links = document.querySelectorAll( "link[data-rjs]" );
            [].concat( scripts, links ).forEach(function( el ){
              if ( el.type ) {
                el.parentNode.removeChild( el );
              }
            });
          }

        };
      };

  return new Rjs();

}( this ));