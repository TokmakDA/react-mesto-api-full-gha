const express = require('express');
const { celebrate } = require('celebrate');
const { cardSchema, idSchema } = require('../utils/validationSchemes');
const {
  getCards,
  createCard,
  deleteCard,
  addLikeCard,
  deleteLikeCard,
} = require('../controllers/cards');

const cardRouter = express.Router();

//  GET /cards — возвращает все карточки
cardRouter.get('/', getCards);

//  POST /cards — создаёт карточку
cardRouter.post('/', celebrate(cardSchema), createCard);

//  DELETE /cards/:cardId — удаляет карточку по идентификатору
cardRouter.delete('/:cardId', celebrate(idSchema), deleteCard);

//  PUT /cards/:cardId/likes — поставить лайк карточке
cardRouter.put('/:cardId/likes', celebrate(idSchema), addLikeCard);

//  DELETE /cards/:cardId/likes — убрать лайк с карточки
cardRouter.delete('/:cardId/likes', celebrate(idSchema), deleteLikeCard);

module.exports = { cardRouter };
