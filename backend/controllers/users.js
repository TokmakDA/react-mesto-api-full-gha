const bcrypt = require('bcrypt');
const User = require('../models/user');
const {
  NotFoundError,
  ConflictError,
} = require('../errors/errors');
const { generateToken } = require('../utils/token');

// Получить пользователя из базы по ID
const getUserFindById = (id) => {
  console.log('getUserFindById => id', id); //    ТЕСТ
  return User.findById(id).orFail(() => {
    throw new NotFoundError(`Пользователь ${id} не найден`);
  });
};

// Внести изменения в данных пользователя из базы по ID
const setFindByIdAndUpdate = (id, data) => {
  console.log('setFindByIdAndUpdate = id, data', id, data); //    ТЕСТ
  return User.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  }).orFail(() => {
    throw new NotFoundError(`Пользователь ${id} не найден`);
  });
};

//  POST /signup — создаёт пользователя
const createUser = (req, res, next) => {
  const {
    email,
    password,
    name,
    about,
    avatar,
  } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => {
      User.create({
        email,
        password: hash,
        name,
        about,
        avatar,
      })
        .then((user) => {
          // выбираем данные для передачи пользователю
          res.status(201).json({
            data: {
              _id: user._id,
              name: user.name,
              about: user.about,
              avatar: user.avatar,
              email: user.email,
            },
          }); // вернем данные
        })
        .catch((err) => {
          if (err.code === 11000) {
            next(
              new ConflictError(
                'Пользователь с введенным Вами Email уже существует',
              ),
            );
          } else {
            next(err);
          }
        });
    })
    .catch(next);
};

//  GET /users — возвращает всех пользователей
const getUsers = (req, res, next) => {
  User.find()
    .then((users) => {
      res.json({ data: users });
    })
    .catch(next);
};

//  GET /users/:userId - возвращает пользователя по _id
const getUser = (req, res, next) => {
  const { userId } = req.params;
  getUserFindById(userId)
    .then((user) => {
      res.json({ data: user });
    })
    .catch(next);
};

//  GET /users/me - возвращает информацию о текущем пользователе
const getUserMe = (req, res, next) => {
  const userId = req.user._id;
  getUserFindById(userId)
    .then((user) => {
      // выбираем поля для передачи пользователю
      res.json({
        data: {
          _id: user._id,
          name: user.name,
          about: user.about,
          avatar: user.avatar,
          email: user.email,
        },
      });
    })
    .catch(next);
};

// PATCH /users/me — обновляет профиль
const patchUser = (req, res, next) => {
  const { name, about } = req.body;
  const userId = req.user._id;
  setFindByIdAndUpdate(userId, { name, about })
    .then((user) => {
      res.json({
        data: {
          _id: user._id,
          name: user.name,
          about: user.about,
          avatar: user.avatar,
          email: user.email,
        },
      });
    })
    .catch(next);
};

// PATCH /users/me/avatar — обновляет аватар
const patchAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const userId = req.user._id;
  setFindByIdAndUpdate(userId, { avatar })
    .then((user) => {
      res.json({
        data: {
          _id: user._id,
          name: user.name,
          about: user.about,
          avatar: user.avatar,
          email: user.email,
        },
      });
    })
    .catch(next);
};

//  POST /signin — авторизует пользователя
const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const { _id } = user;
      const token = generateToken({ _id }); // сгенерировали токен
      // вернём токен пользователю
      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
          sameSite: 'None',
          secure: true, // с этим параметром тесты валятся
        })
        .status(200)
        .json({
          data: {
            _id: user._id,
            name: user.name,
            about: user.about,
            avatar: user.avatar,
            email: user.email,
          },
        });
    })
    .catch(next);
};

//  GET /signout — очищает куки
const signout = (req, res) => {
  res
    .clearCookie('jwt', {
      maxAge: 3600000 * 24 * 7,
      httpOnly: true,
      sameSite: 'None',
      secure: true, // с этим параметром тесты валятся
    })
    .send({ message: 'Exit' });
};

module.exports = {
  getUsers,
  getUser,
  getUserMe,
  login,
  signout,
  createUser,
  patchUser,
  patchAvatar,
};
