window._spy = [];

var SANDBOX_ID = "sandbox";

function createSandbox() {
  var sandbox = document.createElement( "div" );
  sandbox.id = SANDBOX_ID;
  document.body.appendChild( sandbox );
}

function removeSandbox() {
  document.body.removeChild( document.getElementById( SANDBOX_ID ) );
}

describe( "Rjs", function(){
  "use strict";

   // First we get test DOM and load prototypes for a concrete form and a concrete model
  beforeEach(function(){
    createSandbox();
    _spy = [];
    rjs.init();
  });

  afterEach(function(){
    rjs.reset();
    removeSandbox();
  });

  it( "loads and executes dependency code", function( done ){
    done();
    rjs.define( "/stubs/dep1.js", "dependencyA", function(){
      expect( _spy.indexOf( "dep1" ) ).not.toEqual( -1 );
      done();
    }, this );
  });

  it( "calls the handler when dependency resolved", function( done ){
    rjs.define( "/stubs/dep2.js", "dependencyB" );
    rjs.require([ "dependencyB" ], function(){
      expect( _spy.indexOf( "dep2" ) ).not.toEqual( -1 );
      done();
    }, this );
  });

  it( "calls the handler when dependency resolved and DOMContentLoaded", function( done ){
    rjs.require([ "DOMContentLoaded", "dependencyB" ], function(){
      expect( _spy.indexOf( "dep2" ) ).not.toEqual( -1 );
      done();
    }, this );
    rjs.define( "/stubs/dep2.js", "dependencyB" );
  });

  it( "calls the handler when dependencies subsribed prior to registering", function( done ){
    rjs.require([ "dependencyA", "dependencyB" ], function(){
      expect( _spy.indexOf( "dep1" ) ).not.toEqual( -1 );
      expect( _spy.indexOf( "dep2" ) ).not.toEqual( -1 );
      done();
    }, this );
    rjs.define( "/stubs/dep1.js", "dependencyA" );
    rjs.define( "/stubs/dep2.js", "dependencyB" );
  });

  it( "calls the handler when dependencies subsribed prior and after registering", function( done ){
    rjs.define( "/stubs/dep1.js", "dependencyA" );
    rjs.require([ "dependencyA", "dependencyB" ], function(){
      expect( _spy.indexOf( "dep1" ) ).not.toEqual( -1 );
      expect( _spy.indexOf( "dep2" ) ).not.toEqual( -1 );
      done();
    }, this );
    rjs.define( "/stubs/dep2.js", "dependencyB" );
  });

  it( "calls the handler of a dependency registered on other dependency load event", function( done ){
    rjs.define( "/stubs/dep1.js", "dependencyA" );
    rjs.require([ "dependencyA" ], function(){
      rjs.define( "/stubs/dep2.js", "dependencyB" );
    }, this );
    rjs.require([ "dependencyA", "dependencyB" ], function(){
      expect( _spy.indexOf( "dep1" ) ).not.toEqual( -1 );
      expect( _spy.indexOf( "dep2" ) ).not.toEqual( -1 );
      done();
    }, this );
  });

  it( "loads CSS", function( done ){
    rjs.define( "/stubs/dep3.css", "dependencyC" );
    rjs.require([ "dependencyC" ], function(){
    var borderStyle = window
      .getComputedStyle( document.getElementById( SANDBOX_ID ), null )
      .getPropertyValue( "border-bottom-style" );
      expect( borderStyle ).toEqual( "dotted" );
      done();
    }, this );
  });


});