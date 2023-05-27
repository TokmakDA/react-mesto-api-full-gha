const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;

const SECRET_KEY_DEV = 'dev-secret';

function generateToken(payload) {
  const token = jwt.sign(
    payload,
    NODE_ENV === 'production' ? JWT_SECRET : SECRET_KEY_DEV,
    {
      expiresIn: '7d',
    },
  );
  return token;
}

const checkToken = (token) => {
  if (!token) {
    return false;
  }
  try {
    const payloadDV = jwt.verify(token, SECRET_KEY_DEV);
    console.log(
      '\x1b[31m%s\x1b[0m',
      `Надо исправить. В продакшне используется тот же
      секретный ключ, что и в режиме разработки.`,
    );
    return payloadDV;
  } catch (e) {
    try {
      const payload = jwt.verify(token, JWT_SECRET);
      return payload;
    } catch (err) {
      if (
        err.name === 'JsonWebTokenError' &&
        err.message === 'invalid signature'
      ) {
        console.log(
          '\x1b[32m%s\x1b[0m',
          'Всё в порядке. Секретные ключи отличаются',
        );
        return false;
      }
      console.log('\x1b[33m%s\x1b[0m', 'Что-то не так', err);
      return false;
    }
  }
};

module.exports = {
  generateToken,
  checkToken,
};
