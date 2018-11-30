document.body.insertAdjacentHTML('beforeend', "<div class=\"alert alert-primary\">OK</div>");

describe( "Rjs", function(){
  "use strict";

  it( "loads a single source", function( done ){    
    rjs( "/stubs/modernizr.min.js" )
      .then(() => {
        expect( document.querySelector( "html" ).classList.contains( "js" ) ).toEqual( true );
        done();
      });
  });

  it( "loads multiple sources", function( done ){    
    rjs([ 
      "/stubs/jquery.min.js",
      "/stubs/bootstrap.min.css"
      ])
      .then(() => {
        // boostrap css loaded
        const el = document.querySelector( ".alert" ),
              position = window.getComputedStyle( el, null ).getPropertyValue( "position" );
        expect( position ).toEqual( "relative" );
        // modernizr loaded
        expect( "$" in window ).toEqual( true );
        done();
      });
  });

});