# errors

  Simple abstraction to handle custom errors in your codebase.

## Installation
  
    $npm install segmentio/errors
    $component install segmentio/errors

## Example

```js
var inherit = require('util').inherits;
var RandomError = require('./random-error');
var errors = require('error-map')();


/**
 * Add `Random` error to our known errors map.
 */

errors.add('Random', RandomError);


/**
 * Wrap any errors the map recognizes after getting from Mongo.
 */

function get (id, callback) {
  mongo.findById(id, function (err, res) {
    callback(errors.wrap(err), res);
  });
}
```

```js
// random-error.js

/**
 * Random Error.
 */

function RandomError (err) {
  Error.call(this);
  Error.captureStackTrace(this, arguments.callee);
}

util.inherits(RandomError, Error);


/**
 * Check if `err` is a `RandomError`.
 */

RandomError.is = function (err) {
  return err && err.code == 1042;
};
```

## API

### errors()
  
  Initialize a new error map.

### .Errors
  
  The map of error constructors, so you can expose it so external APIs can do things like check `instanceof`.

### #add(name, Constructor)
  
  Add a new error `Constructor` to the map with `name`. The `Constructor` must have a function to check whether the error is its type exposed as `.is`.

### #match(error)

  Check with the `error` matches any of the rules of the custom constructors.

### #wrap(error)
  
  Wrap an `error` in its appropriate custom constructor.
