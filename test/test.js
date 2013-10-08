
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
      var self = this.errors.add(Errors);
      assert(self === this.errors);
      assert(this.errors.Errors.DivideByZero === Errors.DivideByZero);
      assert(this.errors.Errors.MongoDuplicate === Errors.MongoDuplicate);
    });
  });

  describe('#find', function () {
    beforeEach(function () {
      this.errors.add(Errors);
    });

    it('should find an error', function () {
      var err = this.errors.find(new Error('Division by 0'));
      assert(err === Errors.DivideByZero);
    });

    it('should not find an unknown error', function () {
      var err = this.errors.find(new Error());
      assert(!err);
    });

    it('should not find a non-error', function () {
      var err = this.errors.find(4);
      assert(!err);
    });
  });

  describe('#match', function () {
    beforeEach(function () {
      this.errors.add(Errors);
    });

    it('should match an error', function () {
      assert(this.errors.match(new Error('Division by 0')));
    });

    it('should not match an unknown error', function () {
      assert(!this.errors.match(new Error()));
    });

    it('should not match a non-error', function () {
      assert(!this.errors.match(4));
    });
  });

  describe('#wrap', function () {
    beforeEach(function () {
      this.errors.add(Errors);
    });

    it('should wrap a known error', function () {
      var err = this.errors.wrap(new Error('E11000'));
      assert(err);
      assert(err instanceof Errors.MongoDuplicate);
    });

    it('should pass through an unknown error', function () {
      var error = new Error();
      var err = this.errors.wrap(error);
      assert(err);
      assert(err === error);
    });

    it('should pass through null', function () {
      var err = this.errors.wrap(null);
      assert(err === null);
    });
  });

});