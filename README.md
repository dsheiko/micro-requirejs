Micro RequireJS
==============

[![NPM](https://nodei.co/npm/micro-requirejs.png)](https://nodei.co/npm/micro-requirejs/)

[![Build Status](https://travis-ci.org/dsheiko/micro-requirejs.png?branch=master)](https://travis-ci.org/dsheiko/micro-requirejs)
[![Bower version](https://badge.fury.io/bo/micro-requirejs.svg)](http://badge.fury.io/bo/micro-requirejs)


A substantial web application doesn't need to wait until all the required
JavaScript libraries loaded. Usually most of them can load asynchronously
 and start acting whenever they are ready. Most commonly used approach
here would be AMD. That's a sophisticated and time-proved solution.
However to use it with libraries, you must have them converted to modules.
I don't appreciate the idea to interfere with 3-rd party library code, besides I would prefer loader library as small as possible.
So here we go! Micro-RequireJS is just **1.5KB** (gzipped JavaScript) and at the same time
it allows you to control non-blocking (async) script loading and dependency resolution.


### How to use

Let's create a few of dependency scripts:

dependencyA.js:
```
console.log( "dependencyA.js is being loaded..." );
```
dependencyB.js:
```
console.log( "dependencyB.js is being loaded..." );
```

Now we can use the library:
```
<!DOCTYPE html>
<html>
<body>
<script type="text/javascript" src="./rjs.min.js"></script>
<script type="text/javascript">
rjs.define( "./dependencyA.js", "dependencyA" );
rjs.define( "./dependencyB.js", "dependencyB" );
rjs.define( "./dependencyC.css", "dependencyB" );

rjs.require([ "dependencyA" ], function(){
   console.log("dependencyA.js is loaded");
});
rjs.require([ "DOMContentLoaded", "dependencyA", "dependencyB", "dependencyC" ], function(){
   console.log("dependencyA.js, dependencyB.js, dependencyC.js and DOM are loaded");
});
</script>
</body>
</html>
```

As we don't need any modification on dependent scripts, we can load e.g. jQuery asynchronously
```
rjs.define("//ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js", "jQuery");
rjs.require([ "jQuery" ], function(){
   var $ = window.jQuery;
});
```

You can run tests like that:
```
npm test
```

Note that to use this library with IE8 you need to load ES5 shim (https://github.com/es-shims/es5-shim)
and AddEventListener polyfill (https://css-tricks.com/snippets/javascript/addeventlistner-polyfill/).
See `./tests/test-ie8.html`


[![Analytics](https://ga-beacon.appspot.com/UA-1150677-13/dsheiko/micro-requirejs)](http://githalytics.com/dsheiko/micro-requirejs)