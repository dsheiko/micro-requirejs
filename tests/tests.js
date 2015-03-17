var atomus = require( "atomus" ),
    expect = require( "chai" ).expect,
    path = require( "path" ),
    CWD = "file://" + __dirname;

"use strict";
/**
 * HERE WE GO!
 */
describe( "Rjs", function(){

  // First we get test DOM and load prototypes for a concrete form and a concrete model
  before(function( done ){
    var that = this;
    this.browser = atomus()
      .html( "<html><head></head><body></body></html>" )
      .injectJS( "window._logger = [];" )
      .external( path.join( __dirname, "/../" ) + "rjs.js" )
      .ready( function( err, window ){
        that.rjs = window.rjs;
        that.logger = window._logger;
        done();
      });
  });

  it( "loads and executes dependency code", function( done ){
    this.rjs.define( CWD + "/stubs/dep1.js", "dependencyA", function(){
      expect( this.logger.indexOf( "dep1" ) !== -1 ).to.be.ok;
      done();
    }, this );
  });

  it( "calls the handler when dependency resolved", function( done ){
    this.rjs.define( CWD + "/stubs/dep2.js", "dependencyB" );
    this.rjs.require([ "dependencyB" ], function(){
      expect( this.logger.indexOf( "dep2" ) !== -1 ).to.be.ok;
      done();
    }, this );
  });

  it( "calls the handler when dependency resolved and DOMContentLoaded", function( done ){
    this.rjs.define( CWD + "/stubs/dep2.js", "dependencyB" );
    this.rjs.require([ "DOMContentLoaded", "dependencyB" ], function(){
      expect( this.logger.indexOf( "dep2" ) !== -1 ).to.be.ok;
      done();
    }, this );
  });

  it( "calls the handler when dependencies subsribed prior to registering", function( done ){
    this.rjs.require([ "dependencyA", "dependencyB" ], function(){
      expect( this.logger.indexOf( "dep1" ) !== -1 ).to.be.ok;
      expect( this.logger.indexOf( "dep2" ) !== -1 ).to.be.ok;
      done();
    }, this );
    this.rjs.define( CWD + "/stubs/dep1.js", "dependencyA" );
    this.rjs.define( CWD + "/stubs/dep2.js", "dependencyB" );
  });

  it( "calls the handler when dependencies subsribed prior and after registering", function( done ){
    this.rjs.define( CWD + "/stubs/dep1.js", "dependencyA" );
    this.rjs.require([ "dependencyA", "dependencyB" ], function(){
      expect( this.logger.indexOf( "dep1" ) !== -1 ).to.be.ok;
      expect( this.logger.indexOf( "dep2" ) !== -1 ).to.be.ok;
      done();
    }, this );
    this.rjs.define( CWD + "/stubs/dep2.js", "dependencyB" );
  });

  it( "calls the handler of a dependency registered on other dependency load event", function( done ){
    this.rjs.define( CWD + "/stubs/dep1.js", "dependencyA" );
    this.rjs.require([ "dependencyA" ], function(){
      this.rjs.define( CWD + "/stubs/dep2.js", "dependencyB" );
    }, this );
    this.rjs.require([ "dependencyA", "dependencyB" ], function(){
      expect( this.logger.indexOf( "dep1" ) !== -1 ).to.be.ok;
      expect( this.logger.indexOf( "dep2" ) !== -1 ).to.be.ok;
      done();
    }, this );
  });

//    rjs.define("./stubs/dep2.js", "dependencyB");
//    rjs.require([ "dependencyA-loaded", "dependencyB-loaded" ], function(){
//      console.log(global._logger);
//      assert.ok( global._logger.indexOf("dep1") !== -1 );
//      assert.ok( global._logger.indexOf("dep2") !== -1 );
//      QUnit.start();
//    });

});