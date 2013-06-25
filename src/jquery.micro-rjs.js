/*
 * @package Micro-RequireJs
 * @author sheiko
 * @license MIT
 * @copyright (c) Dmitry Sheiko http://www.dsheiko.com
 * @jscs standard:Jquery
 * Code style: http://docs.jquery.com/JQuery_Core_Style_Guidelines
 */
var module = module || {},
    rjs = (function( global, exports ){
   "use strict";
    var document = global.document,
        $ = global.jQuery,
        queue = {},
       eventQueue = (function(){
           var Constr = function() {
                var queue = [];
                return {
                    /**
                     * Register a supplied event to the queue
                     *
                     * @param {string} eventName
                     */
                    register: function( eventName ) {
                        $.inArray( eventName, queue ) === -1 && queue.push( eventName );
                    },
                    /**
                     * Checks if all the events of a supplied array already registered
                     * in the queue
                     *
                     * @param {array} events
                     */
                    isResolved: function( events )  {
                        var i = 0, len = events.length;
                        if (!len) {
                            return false;
                        }
                        for ( ; i < len; i++ ) {
                            // If at least one event of the supplied list is not
                            // yet fired, the queue is not resolved
                            if ( $.inArray( events[ i ], queue ) === -1 ) {
                                return false;
                            }
                        }
                        return true;
                    }
                };
            };
            return new Constr();
       }());
       return (function(){
            // Register DOMContentLoaded event
           $( document ).on( "DOMContentLoaded", function( ){
               eventQueue.register("DOMContentLoaded");
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
                    document.body.appendChild( script );
                    $( script ).on( "load", function(){
                        var eventName = dependency + "-loaded";
                        eventQueue.register( eventName );
                        // Fires event when the script is loaded
                        $( document ).trigger( eventName, [ exports ] );
                        completeFn && completeFn();
                    });
                },
                /**
                 * Call the function fn when all supplied events fired
                 *
                 * @param {array} dependencies
                 * @param {function} fn - callback function that is executed
                 *  when all the supplied dependencies resolved
                 */
                require: function( events, fn ) {
                    // Event fired before a handler subscribed
                    if ( eventQueue.isResolved( events ) ) {
                         return fn( module );
                    }
                    // Event fired after a handler subscribed
                    events.forEach(function( eventName ){
                        $( document ).on( eventName, function( e, module ){
                            eventQueue.isResolved( events ) && fn( module );
                        });
                    });
                }
           };
       }());
}( window, module ));