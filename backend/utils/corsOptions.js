const allowedCors = [
  'https://praktikum.tk',
  'http://praktikum.tk',
  'localhost:3000',
  'http://localhost:3000',

  'http://e-tokmak.ru',
  'https://e-tokmak.ru',
  'http://api.mesto.e-tokmak.ru',
  'https://api.mesto.e-tokmak.ru',
  'http://mesto.e-tokmak.ru',
  'https://mesto.e-tokmak.ru',
  'api.mesto.e-tokmak.ru',
  'mesto.e-tokmak.ru',
  'e-tokmak.ru',
];
// Значение для заголовка Access-Control-Allow-Methods по умолчанию (разрешены все типы запросов)
const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';

const corsOptions = {
  origin: allowedCors,
  methods: DEFAULT_ALLOWED_METHODS,
  credentials: true,
};

module.exports = corsOptions;
