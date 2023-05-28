const COOKIE_PARAMS = {
  maxAge: 3600000 * 24 * 7,
  httpOnly: true,
  sameSite: 'None',
  secure: true, // с этим параметром тесты валятся и постман не работает cookie работают только по https
};

module.exports = {
  COOKIE_PARAMS,
};
