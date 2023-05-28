const { celebrate } = require('celebrate');
const auth = require('../middlewares/auth');
const { cardRouter } = require('./cards');
const { userRouter } = require('./users');
const { NotFoundError } = require('../errors/NotFoundError');
const {
  userSchemaLogin,
  userSchemaCreate,
} = require('../utils/validationSchemes');
const {
  login,
  createUser,
  signout,
} = require('../controllers/users');
const limiter = require('../middlewares/limiter');

module.exports = require('express')
  .Router()
  .use(limiter)
  .post('/signin', celebrate(userSchemaLogin), login)
  .post('/signup', celebrate(userSchemaCreate), createUser)
  .get('/signout', signout)
  .use(auth)
  .use('/cards', cardRouter)
  .use('/users', userRouter)
  .use('*', (req, res, next) => {
    next(new NotFoundError('Not found'));
  });
