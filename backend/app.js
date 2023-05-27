require('dotenv').config();
const express = require('express');
const process = require('process');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const bodyParser = require('body-parser');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const routes = require('./routes');
const { handleError } = require('./errors/errors');
const corsOptions = require('./utils/corsOptions');

const app = express();
const { PORT = 3000 } = process.env;

app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/mestodb').catch((err) => {
  console.log(err);
});

app.use(cookieParser());
app.use(express.json());
app.use(requestLogger); // подключаем логгер запросов
//  Краш-тест сервера
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});
app.use(cors(corsOptions));
app.use('/', routes);
app.use(errorLogger); // подключаем логгер ошибок
app.use(errors()); // обработчик ошибок celebrate
// централизованный обработчик ошибок
app.use((err, req, res, next) => {
  handleError(err, req, res, next);
  next();
});

app.listen(PORT, () => {
  console.log(`Start server, port:${PORT}`);
  console.log(process.env.NODE_ENV);
});
