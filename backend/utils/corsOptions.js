const allowedCors = [
  'https://praktikum.tk',
  'http://praktikum.tk',
  'localhost:3000',
  'http://localhost:3000',
  'localhost:3001',
  'http://localhost:3001',
  'http://192.168.1.212:3001',
  'http://192.168.1.212:3000',
  'tokmak-da.mesto.nomoredomains.monster',
  'https://tokmak-da.mesto.nomoredomains.monster',
  'http://tokmak-da.mesto.nomoredomains.monster',
  'api.tokmak-da.mesto.nomoredomains.rocks',
  'https://api.tokmak-da.mesto.nomoredomains.rocks',
  'http://api.tokmak-da.mesto.nomoredomains.rocks',
  'https://tokmakda.github.io',
  'http://tokmakda.github.io',
  'tokmakda.github.io',
];
// Значение для заголовка Access-Control-Allow-Methods по умолчанию (разрешены все типы запросов)
const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';

const corsOptions = {
  origin: allowedCors,
  methods: DEFAULT_ALLOWED_METHODS,
  credentials: true,
};

module.exports = corsOptions;
