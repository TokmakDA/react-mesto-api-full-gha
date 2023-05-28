const { Joi } = require('celebrate');

const userConfig = {
  name: Joi.string()
    .min(2)
    .max(30)
    .required()
    .label('Имя')
    .messages({
      'string.min': 'Поле {#label} должно быть не менее {#limit} символов.',
      'string.max': 'Поле {#label} должно быть не более {#limit} символов.',
      'any.required': 'Поле {#label} обязательное.',
      'string.empty': 'Поле {#label} не может быть пустым.',
    }),
  about: Joi.string()
    .min(2)
    .max(30)
    .required()
    .label('О себе')
    .messages({
      'string.min': 'Поле {#label} должно быть не менее {#limit} символов.',
      'string.max': 'Поле {#label} должно быть не более {#limit} символов.',
      'any.required': 'Поле {#label} обязательное.',
      'string.empty': 'Поле {#label} не может быть пустым/',
    }),
  avatar: Joi.string()
    .regex(/(https?:\/\/)\w+?(\S+|W+)?(\w+)?.\w{2,15}\/?/)
    .required()
    .label('Аватар')
    .messages({
      'string.pattern.base':
        'Поле {#label} должно быть ссылкой. Не соответствует образцу {#regex}',
      'string.base':
        'Поле {#label} должно быть ссылкой. Не соответствует образцу {#regex}',
      'any.required': 'Поле {#label} обязательное.',
      'string.empty': 'Поле {#label} не может быть пустым.',
    }),
  email: Joi.string()
    .email()
    .required()
    .label('Email')
    .messages({
      'string.email':
        '{#label} должен быть действительным адресом электронной почты.',
      'any.required': 'Поле {#label} обязательное.',
      'string.empty': 'Поле {#label} не может быть пустым',
    }),
  password: Joi.string()
    .min(8)
    .required()
    .label('Пароль')
    .messages({
      'string.min': 'Ваш {#label} должн быть не менее {#limit} символов.',
      'any.required': 'Поле {#label} обязательное.',
      'string.empty': 'Поле {#label} не может быть пустым.',
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
    userId: Joi.string()
      .hex()
      .length(24)
      .required()
      .label('userId')
      .messages({
        'string.hex': '{#label} должно быть в Hex-строкой.',
        'string.length': '{#label} длина должна быть {#limit} символа.',
        'any.required': 'Поле {#label} обязательное.',
        'string.empty': 'Поле {#label} не может быть пустым.',
      }),
  }),
};

const cardIdSchema = {
  params: Joi.object().keys({
    cardId: Joi.string()
      .hex()
      .length(24)
      .required()
      .label('cardId')
      .messages({
        'string.hex': '{#label} должно быть в Hex-строкой.',
        'string.length': '{#label} длина должна быть {#limit} символа.',
        'any.required': 'Поле {#label} обязательное.',
        'string.empty': 'Поле {#label} не может быть пустым.',
      }),
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
          'Поле {#label} должно быть ссылкой. Не соответствует образцу {#regex}',
        'string.base':
          'Поле {#label} должно быть ссылкой. Не соответствует образцу {#regex}',
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
