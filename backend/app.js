require('dotenv').config();
const express = require('express');
const process = require('process');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { errors } = require('celebrate');
const routes = require('./routes');
const { handleError } = require('./errors/errors');

const app = express();
const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb').catch((err) => {
  console.log(err);
});

app.use(cookieParser());
app.use(express.json());
app.use(requestLogger); // подключаем логгер запросов
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
