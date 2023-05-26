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

function checkToken(token) {
  if (!token) {
    return false;
  }
  try {
    // // // Проверяем по ключу DEV
    // const payload = jwt.verify(token, SECRET_KEY_DEV);
    // console.log(
    //   '\x1b[31m%s\x1b[0m',
    //   `Надо исправить. В продакшне используется тот же
    //       секретный ключ, что и в режиме разработки.`,
    // );

    // Проверяем по ключу Production и возвращаем пейлоуд
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    // // Доп проверка если ошибка по ключу DEV
    // if (
    //   err.name === 'JsonWebTokenError' &&
    //   err.message === 'invalid signature'
    // ) {
    //   console.log(
    //     '\x1b[32m%s\x1b[0m',
    //     'Всё в порядке. Секретные ключи отличаются',
    //   );
    // } else {
    //   console.log('\x1b[33m%s\x1b[0m', 'Что-то не так', err);
    // }
    return false;
  }
}

module.exports = {
  generateToken,
  checkToken,
};
