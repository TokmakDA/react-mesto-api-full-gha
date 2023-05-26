const allowedCors = [
  'https://praktikum.tk',
  'http://praktikum.tk',
  'localhost:3000',
  'http://localhost:3000',
  'https://localhost:3000',
  'localhost:3001',
  'http://localhost:3001',
  'https://localhost:3001',
  'tokmak-da.mesto.nomoredomains.monster',
  'https://tokmak-da.mesto.nomoredomains.monster',
  'http://tokmak-da.mesto.nomoredomains.monster',
  'api.tokmak-da.mesto.nomoredomains.rocks',
  'https://api.tokmak-da.mesto.nomoredomains.rocks',
  'http://api.tokmak-da.mesto.nomoredomains.rocks',
  'https://tokmakda.github.io/react-mesto-api-full-gha',
  'http://tokmakda.github.io/react-mesto-api-full-gha',
  'tokmakda.github.io/react-mesto-api-full-gha',
];
// Значение для заголовка Access-Control-Allow-Methods по умолчанию (разрешены все типы запросов)
const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';

module.exports = (req, res, next) => {
  res.header('Access-Control-Allow-Credentials', true);
  const { origin } = req.headers; // Сохраняем источник запроса в переменную origin
  // проверяем, что источник запроса есть среди разрешённых
  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }

  console.log(req.headers);

  const { method } = req; // Сохраняем тип запроса (HTTP-метод) в соответствующую переменную
  const requestHeaders = req.headers['access-control-request-headers'];

  // Если это предварительный запрос, добавляем нужные заголовки
  if (method === 'OPTIONS') {
    // разрешаем кросс-доменные запросы любых типов (по умолчанию)
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    // разрешаем кросс-доменные запросы с этими заголовками
    res.header('Access-Control-Allow-Headers', requestHeaders);
    // завершаем обработку запроса и возвращаем результат клиенту
    return res.end();
  }
  return next();
};
