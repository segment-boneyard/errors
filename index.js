
/**
 * Expose `Errors`.
 */

module.exports = Errors;


/**
 * Initialize a new `Errors` instance.
 */

function Errors () {
  if (!(this instanceof Errors)) return new Errors();
  this.Errors = {};
}


/**
 * Add a new error `Constructor` to the map with `name`. The `Constructor`
 * must have a function to check whether the error is its type exposed as
 * `.is`.
 *
 * @param {String or Object} name
 * @param {Function} Constructor
 */

Errors.prototype.add = function (name, Constructor) {
  if (typeof name === 'object') {
    for (var key in name) this.add(key, name[key]);
    return this;
  }

  if (typeof name === 'function') {
    Constructor = name;
    name = Constructor.name;
  }

  if (typeof Constructor.is !== 'function') {
    throw new Error('Constructors must have a .is method to check against errors.');
  }

  this.Errors[name] = Constructor;
  return this;
};


/**
 * Wrap a `callback` to convert known errors to their respective instances.
 *
 * @param {Function} callback
 * @return {Function}
 */

Errors.prototype.wrap = function (callback) {
  var self = this;
  return function (err, args) {
    args = [].slice.call(arguments);
    var Error = self.match(err);
    if (Error) args[0] = new Error(err);
    callback.apply(this, args);
  };
};


/**
 * Match an `err` against all of our errors's matcher functions.
 *
 * @param {Error} err
 * @return {Function|Null}
 * @api private
 */

Errors.prototype.match = function (err) {
  for (var key in this.Errors) {
    var Error = this.Errors[key];
    if (Error.is(err)) return Error;
  }
  return null;
};