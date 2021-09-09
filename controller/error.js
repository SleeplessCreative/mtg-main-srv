/**
 *
 * @param {*} errorCode error code
 * @param {*} message message that explaining the error(s)
 */

exports.errorFunc = (errorCode, message) => {
  const error = new Error(message);
  error.statusCode = errorCode;
  throw error;
};
