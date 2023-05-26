const { BadRequestError } = require('./BadRequestError');
const { ConflictError } = require('./ConflictError');
const { DefaltError } = require('./DefaltError');
const { ForbiddenError } = require('./ForbiddenError');
const { NotFoundError } = require('./NotFoundError');
const SomeError = require('./SomeError');
const { UnauthorizedError } = require('./UnauthorizedError');

// Вернуть ошибку пользователю
const returnErrorToUser = (err, req, res, next) => {
  res.status(err.statusCode).send({ message: err.message }).end();
  next();
};

function handleError(err, req, res, next) {
  console.log('handleError => err', err.statusCode, err.name);

  if (err instanceof SomeError) {
    returnErrorToUser(err, req, res, next);
  } else if (err.name === 'CastError') {
    const newErr = new BadRequestError('Incorrect ID');
    returnErrorToUser(newErr, req, res, next);
  } else if (err.name === 'ValidationError') {
    const message = Object.values(err.errors)
      .map((error) => error.message)
      .join('; ');
    const newErr = new BadRequestError(message);
    returnErrorToUser(newErr, req, res, next);
  } else if (err.message === 'Validation failed') {
    // Ошибки перехваченные от celebrate
    next(err);
  } else {
    const newErr = new DefaltError('Swth went wrong. Все пошло не так.');
    returnErrorToUser(newErr, req, res, next);
  }
}

module.exports = {
  handleError,
  BadRequestError,
  ConflictError,
  DefaltError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
};
