Micro RequireJS
==============
[![Build Status](https://travis-ci.org/dsheiko/micro-requirejs.png?branch=master)](https://travis-ci.org/dsheiko/micro-requirejs)
[![NPM version](https://badge.fury.io/js/micro-requirejs.png)](http://badge.fury.io/js/micro-requirejs)

A substantial web application doesn't need to wait until all the required
JavaScript libraries loaded. Usually most of them can load asynchronously
 and start acting whenever they are ready. Most commonly used approach
here would be AMD. That's a sophisticated and time-proved solution.
However to use it with libraries, you must have them converted to modules.
I don't appreciate the idea to interfere with 3-rd party library code.
At the same time I still need non-blocking loading and dependency
being resolved in my code. Thus,
I worked out a very simple, but yet working solution.

### How to use

Let's create a few of dependency scripts:

dependencyA.js:
```
console.log("dependencyA.js is being loaded...");
```
dependencyB.js:
```
console.log("dependencyB.js is being loaded...");
```

Now we can use the library:
```
<!DOCTYPE html>
<html>
<body>
<script type="text/javascript">
rjs.define("./dependencyA.js", "dependencyA");
rjs.define("./dependencyB.js", "dependencyB");

rjs.require(['DOMContentLoaded', "dependencyA-loaded"], function(){
   console.log("dependencyA.js and DOM are loaded");
});
rjs.require(['DOMContentLoaded', "dependencyA-loaded", "dependencyB-loaded"], function(){
   console.log("dependencyA.js and dependencyB.js and DOM are loaded");
});
</script>

<script type="text/javascript" src="./micro-rjs.js"></script>
</body>
</html>
```

As we don't need any modification on dependent scripts, we can load e.g. jQuery asynchronously
```
rjs.define("//ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js", "jQuery");
rjs.require(['jQuery"], function(){
   var $ = window.jQuery;
});
```

### Built files

* micro-rjs.min.js - minified version with support Firefox >= 4, IE >=9, any Chrome and Opera >= 11.60
* micro-rjs-ie6.js - shimed version with support for legacy browsers
* micro-rjs-ie6.min.js

[![Analytics](https://ga-beacon.appspot.com/UA-1150677-13/dsheiko/micro-requirejs)](http://githalytics.com/dsheiko/micro-requirejs)