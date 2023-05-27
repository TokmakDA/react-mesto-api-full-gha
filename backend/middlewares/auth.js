const { UnauthorizedError } = require('../errors/errors');
const { checkToken } = require('../utils/token');

module.exports = async (req, res, next) => {
  const token = req.cookies.jwt;
  const token1 = req.cookies;
  console.log('auth => req.cookies.jwt, req.cookies', token, token1);
  const newErr = new UnauthorizedError('Ошибка входа в систему');

  // убеждаемся, что токен присутсвует
  if (!token) {
    next(newErr);
    return;
  }

  // проверяем
  try {
    const payload = await checkToken(token);
    console.log('auth => await checkToken(token) => payload', payload);

    req.user = payload ;
  } catch (err) {
    next(newErr);
  }
  next(); // пропускаем запрос дальше
};
