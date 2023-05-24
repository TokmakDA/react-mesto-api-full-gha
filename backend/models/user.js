const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const { UnauthorizedError } = require('../errors/errors');

const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: false,
    minlength: 2,
    maxlength: 30,
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
      if (!validator.isURL(value)) throw new Error('Invalid Avatar link');
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) throw new Error('Invalid Email');
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select('+password') // this — это модель User
    .then((user) => {
      // не нашёлся — отклоняем промис
      if (!user) {
        return Promise.reject(
          new UnauthorizedError('Incorrect email or password'),
        );
      }
      // нашёлся — сравниваем хеши
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(
            new UnauthorizedError('Incorrect email or password'),
          );
        }
        return user; // вернем user
      });
    });
};

module.exports = mongoose.model('user', userSchema);
