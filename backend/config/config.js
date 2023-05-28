const COOKIE_PARAMS = {
  maxAge: 3600000 * 24 * 7,
  httpOnly: true,
  sameSite: 'None',
  // secure: true, // с этим параметром тесты валятся
};

module.exports = {
  COOKIE_PARAMS,
};
