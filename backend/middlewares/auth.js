const { UnauthorizedError } = require('../errors/errors');
const { checkToken } = require('../utils/token');

module.exports = async (req, res, next) => {
  const token = req.cookies;
  const newErr = new UnauthorizedError('Ошибка входа в систему');

  // убеждаемся, что токен присутсвует
  if (!token) {
    next(newErr);
    return;
  }
  // проверяем
  try {
    req.user = await checkToken(token.jwt);
  } catch (e) {
    try {
      req.user = await checkToken(token);
    } catch (err) {
      next(newErr);
    }
    next(newErr);
  }
  next(); // пропускаем запрос дальше
};
