const { UnauthorizedError } = require('../errors/errors');
const { checkToken } = require('../utils/token');

module.exports = (req, res, next) => {
  const jwtCokie = req.cookies.jwt;
  const jwtToken = req.headers.authorization;
  const newErr = new UnauthorizedError('Ошибка входа в систему');

  // убеждаемся, что токен присутсвует
  if (!jwtCokie && !jwtToken) {
    next(newErr);
    return;
  }
  // проверяем JWT
  try {
    const payload = checkToken(jwtCokie || jwtToken);
    req.user = { _id: payload._id };

  } catch (err) {
    next(newErr);
  }
  next(); // пропускаем запрос дальше
};
