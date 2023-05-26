const SomeError = require('./SomeError');

class ConflictError extends SomeError {
  constructor(message) {
    super(message);
    this.statusCode = 409;
    this.name = 'ConflictError';
  }
}

module.exports = {
  ConflictError,
};
