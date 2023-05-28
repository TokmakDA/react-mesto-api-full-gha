const jwt = require('jsonwebtoken');

module.exports = (token, secretKey) => {
  try {
    const payloadDV = jwt.verify(token, secretKey);
    console.log(
      '\x1b[31m%s\x1b[0m',
      `Надо исправить. В продакшне используется тот же
      секретный ключ, что и в режиме разработки.`,
    );
    return payloadDV;
  } catch (err) {
    if (
      err.name === 'JsonWebTokenError'
      && err.message === 'invalid signature'
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
};
