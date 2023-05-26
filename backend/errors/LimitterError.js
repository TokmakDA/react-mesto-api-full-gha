const SomeError = require('./SomeError');

class LimitterError extends SomeError {
  constructor(message) {
    super(message);
    this.statusCode = 429;
    this.name = 'LimitterError';
  }
}

module.exports = { LimitterError };
