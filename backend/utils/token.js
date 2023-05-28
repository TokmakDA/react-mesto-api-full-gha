const jwt = require('jsonwebtoken');
const checkDeveloperToken = require('../services/checkDeveloperToken');

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
    const payload = jwt.verify(token, JWT_SECRET);
    return payload;
  } catch (e) {
    checkDeveloperToken(token, SECRET_KEY_DEV);
    return false;
  }
};

module.exports = {
  generateToken,
  checkToken,
};
