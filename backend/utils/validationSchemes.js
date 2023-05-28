const { Joi } = require('celebrate');

const userConfig = {
  name: Joi.string()
    .min(2)
    .max(30)
    .required()
    .label('Имя')
    .messages({
      'string.empty': 'Поле {#label} не может быть пустым',
      'string.min': 'Поле {#label} должно быть не менее {#limit} символов',
      'string.max': 'Поле {#label} должно быть не более {#limit} символов',
    }),
  about: Joi.string()
    .min(2)
    .max(30)
    .required()
    .label('О себе')
    .messages({
      'string.empty': 'Поле {#label} не может быть пустым',
      'string.min': 'Поле {#label} должно быть не менее {#limit} символов',
      'string.max': 'Поле {#label} должно быть не более {#limit} символов',
    }),
  avatar: Joi.string()
    .regex(/(https?:\/\/)\w+?(\S+|W+)?(\w+)?.\w{2,15}\/?/)
    .required()
    .label('Аватар')
    .messages({
      'string.pattern.base':
        'Поле {#label} должно быть ссылкой. Не соответствует требуемому образцу {#regex}',
      'string.base':
        'Поле {#label} должно соответствовать предложенному образцу',
      'string.empty': 'Поле {#label} не может быть пустым',
    }),
  email: Joi.string()
    .email()
    .required()
    .label('Email')
    .messages({
      'string.email':
        '{#label} должен быть действительным адресом электронной почты',
      'string.empty': 'Поле {#label} не может быть пустым',
      'any.required': 'Поле {#label} обязательное',
    }),
  password: Joi.string()
    .min(8)
    .required()
    .label('Пароль')
    .messages({
      'string.empty': 'Поле {#label} не может быть пустым',
      'string.min': 'Ваш {#label} должн быть не менее {#limit} символов',
      'any.required': 'Поле {#label} обязательное',
    }),
};

const userSchemaCreate = {
  body: Joi.object().keys({
    email: userConfig.email,
    password: userConfig.password,
  }),
};

const userSchemaLogin = {
  body: Joi.object().keys({
    email: userConfig.email,
    password: userConfig.password,
  }),
};

const userSchemaUpdate = {
  body: Joi.object().keys({
    name: userConfig.name,
    about: userConfig.about,
  }),
};
const userSchemaUpdateAvatat = {
  body: Joi.object().keys({
    avatar: userConfig.avatar,
  }),
};

const userIdSchema = {
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24).required(),
  }),
};
const cardIdSchema = {
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24).required(),
  }),
};
const cardSchema = {
  body: Joi.object().keys({
    name: Joi.string()
      .min(2)
      .max(30)
      .required()
      .label('Название')
      .messages({
        'string.empty': 'Поле {#label} не может быть пустым',
        'string.min': 'Поле {#label} должно быть не менее {#limit} символов',
        'string.max': 'Поле {#label} должно быть не более {#limit} символов',
        'any.required': 'Поле {#label} обязательное',
      }),
    link: Joi.string()
      .required()
      .regex(/(https?:\/\/)\w+?(\S+|W+)?(\w+)?.\w{2,15}\/?/)
      .label('Ссылка на картинку')
      .messages({
        'string.pattern.base':
          'Поле {#label} должно быть ссылкой. Не соответствует требуемому образцу {#regex}',
        'string.base':
          'Поле {#label} должно соответствовать предложенному образцу',
        'string.empty': 'Поле {#label} не может быть пустым',
      }),
  }),
};

module.exports = {
  userSchemaCreate,
  userSchemaLogin,
  userSchemaUpdate,
  userSchemaUpdateAvatat,
  userIdSchema,
  cardIdSchema,
  cardSchema,
};
