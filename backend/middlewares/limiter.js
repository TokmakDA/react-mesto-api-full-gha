const rateLimit = require('express-rate-limit');
const { LimitterError } = require('../errors/LimitterError');

module.exports = rateLimit({
  windowMs: 60 * 1000, // за 1 минут
  max: 250, // можно совершить максимум 250 запросов с одного IP
  handler: (req, res, next) => {
    next(
      new LimitterError('Слишком много запросов с одного IP. Попробуйте позже'),
    );
  },
});
