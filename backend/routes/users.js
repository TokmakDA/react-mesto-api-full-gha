const express = require('express');
const { celebrate } = require('celebrate');
const {
  userSchemaUpdate,
  userSchemaUpdateAvatat,
  idSchema,
} = require('../utils/validationSchemes');
const {
  getUsers,
  getUser,
  getUserMe,
  patchUser,
  patchAvatar,
} = require('../controllers/users');

const userRouter = express.Router();

//  GET /users — возвращает всех пользователей
userRouter.get('/', getUsers);

//  GET /users/me - возвращает информацию о текущем пользователе
userRouter.get('/me', getUserMe);

//  GET /users/:userId - возвращает пользователя по _id
userRouter.get('/:userId/', celebrate(idSchema), getUser);

//  PATCH /users/me — обновляет профиль
userRouter.patch('/me', celebrate(userSchemaUpdate), patchUser);

//  PATCH /users/me/avatar — обновляет аватар
userRouter.patch(
  '/me/avatar',
  celebrate(userSchemaUpdateAvatat),
  patchAvatar,
);

module.exports = { userRouter };
