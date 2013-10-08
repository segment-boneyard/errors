
var inherit = require('util').inherits;


/**
 * DivideByZeroError.
 */

function DivideByZeroError () {
  Error.call(this);
  Error.captureStackTrace(this, arguments.callee);
}

DivideByZeroError.is = function (err) {
  return err && /Division by 0/.test(err.message);
};

inherit(DivideByZeroError, Error);

exports.DivideByZero = DivideByZeroError;


/**
 * MongoDuplicateError.
 */

function MongoDuplicateError () {
  Error.call(this);
  Error.captureStackTrace(this, arguments.callee);
}

MongoDuplicateError.is = function (err) {
  return err && /E11000/.test(err.message);
};

inherit(MongoDuplicateError, Error);

exports.MongoDuplicate = MongoDuplicateError;