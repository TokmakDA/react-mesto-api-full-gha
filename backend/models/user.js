const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const { UnauthorizedError } = require('../errors/errors');

const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: false,
    lebel: 'name',
    minlength: [2, `Поле {Object} должно быть не иенее {VALUE} символов.`],
    maxlength: [30, 'Поле {#label} должно быть не более {#limit} символов.'],
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    required: false,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    required: false,
    default:
      'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate(value) {
      if (!validator.isURL(value)) {
        throw new Error(
          'Поле "Аватар" должно быть ссылкой. Введите правильную ссылку',
        );
      }
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('Введите правильный Email');
      }
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
}, {versionKey: false});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select('+password') // this — это модель User
    .then((user) => {
      // не нашёлся — отклоняем промис
      if (!user) {
        return Promise.reject(
          new UnauthorizedError('Неправильные почта или пароль'),
        );
      }
      // нашёлся — сравниваем хеши
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(
            new UnauthorizedError('Неправильные почта или пароль'),
          );
        }
        return user; // вернем user
      });
    });
};

module.exports = mongoose.model('user', userSchema);
