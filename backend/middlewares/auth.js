const { UnauthorizedError } = require('../errors/errors');
const { checkToken } = require('../utils/token');

module.exports = (req, res, next) => {
  const newErr = new UnauthorizedError('Ошибка входа в систему');
  // const jwtCokie = req.cookies;
  // console.log('auth до try', jwtCokie);
  try {
    const jwtCokie = req.cookies.jwt;
    if (!jwtCokie) {
      console.log('auth => !jwtCokie!');
      next(newErr);
      return;
    }
    const payload = checkToken(jwtCokie);
    console.log('auth => jwtCokie => checkToken;', payload);
    if (!payload) {
      console.log('auth => !payload');
      next(newErr);
      return;
    }
    req.user = { _id: payload._id };
  } catch (err) {
    console.log('auth => try cath err');
    next(newErr);
  }
  next(); // пропускаем запрос дальше
};
