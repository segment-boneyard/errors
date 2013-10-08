
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
 * Find an `err`'s constructor in our `Errors` dictionary.
 *
 * @param {Error} err
 * @return {Function}
 */

Errors.prototype.find = function (err) {
  for (var key in this.Errors) {
    var Error = this.Errors[key];
    if (Error.is(err)) return Error;
  }
  return null;
};


/**
 * Check if `err` matches one of our constructors.
 *
 * @param {Error} err
 * @return {Boolean}
 */

Errors.prototype.match = function (err) {
  return !! this.find(err);
};


/**
 * Wrap an `err` in its appropriate custom error constructor.
 *
 * @param {Error} err
 * @return {Error}
 */

Errors.prototype.wrap = function (err) {
  var Constructor = this.find(err);
  if (!Constructor) return err instanceof Error ? err : null;
  return new Constructor(err);
};