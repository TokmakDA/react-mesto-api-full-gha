const jwt = require('jsonwebtoken');

function generateToken(payload) {
  const token = jwt.sign(
    payload,
    NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
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
    return jwt.verify(token, SECKRET_KEY);
  } catch (e) {
    return false;
  }
}

module.exports = {
  generateToken,
  checkToken,
};
