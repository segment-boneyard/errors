
var inherit = require('util').inherits;
var assert = require('assert');
var Errors = require('./errors');
var errors = require('..');

describe('errors', function () {

  beforeEach(function () {
    this.errors = errors();
  });

  describe('#add', function () {
    it('should add an error', function () {
      var self = this.errors.add('DivideByZero', Errors.DivideByZero);
      assert(self === this.errors);
      assert(this.errors.Errors.DivideByZero === Errors.DivideByZero);
    });

    it('should require an .is checker function on the constructor', function () {
      try {
        this.errors.add('NoIs', Error);
        assert(false); // should not get here
      } catch (e) {
        assert(e.message === 'Constructors must have a .is method to check against errors.');
      }
    });

    it('should allow adding dictionaries', function () {
      this.errors.add(Errors);
      assert(this.errors.Errors.DivideByZero === Errors.DivideByZero);
      assert(this.errors.Errors.MongoDuplicate === Errors.MongoDuplicate);
    });
  });

  describe('#match', function () {
    beforeEach(function () {
      this.errors.add(Errors);
    });

    it('should match an error', function () {
      var err = this.errors.match(new Error('Division by 0'));
      assert(err === Errors.DivideByZero);
    });

    it('should not match an unknown error', function () {
      var err = this.errors.match(new Error());
      assert(!err);
    });

    it('should not match a non-error', function () {
      var err = this.errors.match(4);
      assert(!err);
    });
  });

  describe('#wrap', function () {
    beforeEach(function () {
      this.errors.add(Errors);
    });

    it('should return a function', function () {
      var callback = this.errors.wrap(function () {});
      assert(typeof callback === 'function');
    });

    it('should match a known error', function () {
      var callback = this.errors.wrap(function (err, user) {
        assert(err);
        assert(err instanceof Errors.MongoDuplicate);
      });
      callback(new Error('E11000'));
    });

    it('should pass through an unknown error', function () {
      var error = new Error();
      var callback = this.errors.wrap(function (err, user) {
        assert(err);
        assert(err === error);
      });
      callback(error);
    });

    it('should pass through successful arguments', function () {
      var callback = this.errors.wrap(function (err, user) {
        assert(!err);
        assert(user.id === 'id');
      });
      callback(null, { id: 'id' });
    });
  });

});