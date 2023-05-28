const { UnauthorizedError } = require('../errors/errors');
const { checkToken } = require('../utils/token');

module.exports = (req, res, next) => {
  const newErr = new UnauthorizedError('Ошибка входа в систему');

  try {
    const jwtCokie = req.cookies.jwt;

    if (!jwtCokie) {
      console.log('auth => !jwtToken and jwtCokie!;');
      next(newErr);
    }
    const payload = checkToken(jwtCokie);
    console.log('auth => jwtCokie;', payload);
    if (!payload) {
      console.log('auth => !jwtToken and jwtCokie!;');
      next(newErr);
    }
    req.user = { _id: payload._id };
  } catch (err) {
    console.log('auth => try cath;');
    next(newErr);
  }
  next(); // пропускаем запрос дальше
};
