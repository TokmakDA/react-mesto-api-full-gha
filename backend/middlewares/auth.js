const { UnauthorizedError } = require('../errors/errors');
const { checkToken } = require('../utils/token');

module.exports = async (req, res, next) => {
  const newErr = new UnauthorizedError('Ошибка входа в систему');

  try {
    const jwtCokie = await req.cookies.jwt;
    const jwtToken = await req.headers.authorization;

    if (jwtCokie) {
      const payload = await checkToken(jwtCokie);
      console.log('auth => jwtCokie;', payload);
      req.user = { _id: payload._id };
    } else if (jwtToken != 'null') {
      const payload = checkToken(jwtToken);
      console.log('auth => jwtToken;', payload);
      req.user = { _id: payload._id };
    } else {
      console.log('auth => !jwtToken and jwtCokie!;', payload);
      next(newErr);
    }
  } catch (err) {
    console.log('auth => try cath;');
    next(newErr);
  }
  next(); // пропускаем запрос дальше
};
