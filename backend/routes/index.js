const { celebrate } = require('celebrate');
const handleCORS = require('../middlewares/cors');
const auth = require('../middlewares/auth');
const { cardRouter } = require('./cards');
const { userRouter } = require('./users');
const { NotFoundError } = require('../errors/NotFoundError');
const { userSchemaLogin, userSchema } = require('../utils/validationSchemes');
const { login, createUser, signout } = require('../controllers/users');

module.exports = require('express')
  .Router()
  .use(handleCORS)
  .post('/signin', celebrate(userSchemaLogin), login)
  .post('/signup', celebrate(userSchema), createUser)
  .get('/signout', signout)
  .use(auth)
  .use('/cards', cardRouter)
  .use('/users', userRouter)
  .use('*', (req, res, next) => {
    next(new NotFoundError('Not found'));
  });
