Micro RequireJS v2.0
==============
[![No Maintenance Intended](http://unmaintained.tech/badge.svg)](http://unmaintained.tech/)

> WARNING - THIS PROJECT IS NO LONGER MAINTAINED!!!

[![NPM](https://nodei.co/npm/micro-requirejs.png)](https://nodei.co/npm/micro-requirejs/)

[![Build Status](https://travis-ci.org/dsheiko/micro-requirejs.png?branch=master)](https://travis-ci.org/dsheiko/micro-requirejs)
[![Bower version](https://badge.fury.io/bo/micro-requirejs.svg)](http://badge.fury.io/bo/micro-requirejs)

Extremely simple and light-weight (**<1KB** gzipped) asynchronous resource (JavaScript and CSS) loader

If you need support of legacy (like ancient) browsers, go with micro-requirejs v1.x

## How to use

```html
<!DOCTYPE html>
<html>
<body>
...
<script src="./rjs.js"></script>
<script type="text/javascript">
rjs([ 
    "https://code.jquery.com/jquery-3.3.1.slim.min.js",
    "https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css"     
    ])
    .then(() => {
        console.log( "jQuery available, Bootstrap CSS available." );
        return rjs("https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js")
            .then(() => {
                console.log( "Bootstrap JS available." );
            });
    })
    .catch(( err ) => {
        console.error( "Something went wrong", err );
    });
</script>
</body>
</html>
```

### Async function style
```js
async function main() {

    try {
        await rjs([ 
            "https://code.jquery.com/jquery-3.3.1.slim.min.js",
            "https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css"            
        ]);
        await rjs( "https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js" );
        console.log( "jQuery and Bootstrap loaded" );
    } catch ( err ) {
        console.error( err );
    }
}

main();
```

### Injecting extra attributes
```js
// Single source
 await rjs( "https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js", {
            integrity: "sha384-ChfqqxuZUCnJSK3+MXmPNIyE6ZbWh2IMqE241rYiqJxyMiZ6OW/JmZQ5stwEULTy",
            crossorigin: "anonymous"
        });

// Multiple sources
 await rjs([ 
            ["https://code.jquery.com/jquery-3.3.1.slim.min.js", {
                integrity: "sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo",
                crossorigin: "anonymous"
            }],
            "https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css"            
        ]);        

```

You can run tests like that:
```
npm test
```

[![Analytics](https://ga-beacon.appspot.com/UA-1150677-13/dsheiko/micro-requirejs)](http://githalytics.com/dsheiko/micro-requirejs)
