const { default: mongoose } = require('mongoose');
// const { CelebrateError } = require('celebrate');
const { BadRequestError } = require('./BadRequestError');
const { ConflictError } = require('./ConflictError');
const { DefaltError } = require('./DefaltError');
const { ForbiddenError } = require('./ForbiddenError');
const { NotFoundError } = require('./NotFoundError');
const { LimitterError } = require('./LimitterError');
const { UnauthorizedError } = require('./UnauthorizedError');
const SomeError = require('./SomeError');

// Вернуть ошибку пользователю
const returnErrorToUser = (err, req, res, next) => {
  res.status(err.statusCode).send({ message: err.message }).end();
  next();
};

function handleError(err, req, res, next) {
  console.log('handleError => err', err.statusCode, err.name, err.message, err);

  if (err instanceof SomeError) {
    returnErrorToUser(err, req, res, next);
    // } else if (err instanceof CelebrateError) {
    //   // Ошибки перехваченные от celebrate
    //   next(err);
  } else if (err instanceof mongoose.Error.ValidationError) {
    returnErrorToUser(new BadRequestError(err), req, res, next);
  } else if (err instanceof mongoose.Error.CastError) {
    returnErrorToUser(new BadRequestError(err), req, res, next);
  } else {
    returnErrorToUser(
      new DefaltError('Что-то пошло не так. Внутренняя ошибка сервера.'),
      req,
      res,
      next,
    );
  }
}

module.exports = {
  handleError,
  BadRequestError,
  ConflictError,
  DefaltError,
  ForbiddenError,
  NotFoundError,
  LimitterError,
  UnauthorizedError,
};
