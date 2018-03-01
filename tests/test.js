var CWD = ".";
window._spy = [];

/**
 * HERE WE GO!
 */
describe( "Rjs", function(){
  "use strict";

   // First we get test DOM and load prototypes for a concrete form and a concrete model
  beforeEach(function(){
    _spy = [];
    rjs.init();
  });

  afterEach(function(){
    // Remove RJS loaded scrips
    [].slice.call( document.querySelectorAll( "script" ) ).forEach(function( el ){
      if ( el.type ) {
        el.parentNode.removeChild( el );
      }
    });
  });

  it( "loads and executes dependency code", function( done ){
    rjs.define( CWD + "/stubs/dep1.js", "dependencyA", function(){
      expect( _spy.indexOf( "dep1" ) !== -1 ).to.be.ok;
      done();
    }, this );
  });

  it( "calls the handler when dependency resolved", function( done ){
    rjs.define( CWD + "/stubs/dep2.js", "dependencyB" );
    rjs.require([ "dependencyB" ], function(){
      expect( _spy.indexOf( "dep2" ) !== -1 ).to.be.ok;
      done();
    }, this );
  });

  it( "calls the handler when dependency resolved and DOMContentLoaded", function( done ){
    rjs.require([ "DOMContentLoaded", "dependencyB" ], function(){
      expect( _spy.indexOf( "dep2" ) !== -1 ).to.be.ok;
      done();
    }, this );
    rjs.define( CWD + "/stubs/dep2.js", "dependencyB" );
  });

  it( "calls the handler when dependencies subsribed prior to registering", function( done ){
    rjs.require([ "dependencyA", "dependencyB" ], function(){
      expect( _spy.indexOf( "dep1" ) !== -1 ).to.be.ok;
      expect( _spy.indexOf( "dep2" ) !== -1 ).to.be.ok;
      done();
    }, this );
    rjs.define( CWD + "/stubs/dep1.js", "dependencyA" );
    rjs.define( CWD + "/stubs/dep2.js", "dependencyB" );
  });

  it( "calls the handler when dependencies subsribed prior and after registering", function( done ){
    rjs.define( CWD + "/stubs/dep1.js", "dependencyA" );
    rjs.require([ "dependencyA", "dependencyB" ], function(){
      expect( _spy.indexOf( "dep1" ) !== -1 ).to.be.ok;
      expect( _spy.indexOf( "dep2" ) !== -1 ).to.be.ok;
      done();
    }, this );
    rjs.define( CWD + "/stubs/dep2.js", "dependencyB" );
  });

  it( "calls the handler of a dependency registered on other dependency load event", function( done ){
    rjs.define( CWD + "/stubs/dep1.js", "dependencyA" );
    rjs.require([ "dependencyA" ], function(){
      rjs.define( CWD + "/stubs/dep2.js", "dependencyB" );
    }, this );
    rjs.require([ "dependencyA", "dependencyB" ], function(){
      expect( _spy.indexOf( "dep1" ) !== -1 ).to.be.ok;
      expect( _spy.indexOf( "dep2" ) !== -1 ).to.be.ok;
      done();
    }, this );
  });

//  it( "loads CSS", function( done ){
//    rjs.define( CWD + "/stubs/dep3.css", "dependencyC" );
//    rjs.require([ "dependencyC" ], function(){
//      var borderStyle = window
//          .getComputedStyle( document.getElementById( "mocha" ), null )
//          .getPropertyValue( "border-bottom-style" );
//      expect( borderStyle === "dotted" ).to.be.ok;
//      done();
//    }, this );
//  });


});