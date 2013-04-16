/*
* HTML5 Form Shim Test Suit
*
* @package tests
* @author: sheiko
* @version $Id: jquery.html5form.js, v 1.0 $
* @license MIT
* @copyright (c) Dmitry Sheiko http://www.dsheiko.com
* Code style: http://docs.jquery.com/JQuery_Core_Style_Guidelines
*/
(function( global, undefined ){
    var rjs = global.rjs;

        asyncTest("Test dependency scripts loaded asynchronously", function(){
            rjs.define("./js/dependencyA.js", "dependencyA", function(){
                ok( global.isDependencyAloaded );
                start();
            });
        });
        asyncTest("Test dependency scripts loaded asynchronously", function(){
            rjs.define("./js/dependencyB.js", "dependencyB", function(){
                ok( global.isDependencyBloaded );
                start();
            });
        });

        asyncTest("Test required when both DOMContent & dependencyA loaded", function() {
            rjs.require(['DOMContentLoaded', "dependencyA-loaded"], function(){
               ok( global.isDependencyAloaded );
               start();
            });
        });
        asyncTest("Test required when all DOMContent & dependencyA & dependencyB loaded", function() {
            rjs.require(['DOMContentLoaded', "dependencyA-loaded"], function(){
               ok( global.isDependencyAloaded );
               ok( global.isDependencyBloaded );
               start();
            });
        });


}( this ));