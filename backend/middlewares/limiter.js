const rateLimit = require('express-rate-limit');
const { LimitterError } = require('../errors/LimitterError');

module.exports = rateLimit({
  windowMs: 10 * 60 * 1000, // за 10 минут
  max: 100, // можно совершить максимум 100 запросов с одного IP
  handler: (req, res, next) => {
    next(
      new LimitterError('Слишком много запросов с одного IP. Попробуйте позже'),
    );
  },
});
