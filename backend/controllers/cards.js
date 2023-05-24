const Card = require('../models/card');
const { ForbiddenError, NotFoundError } = require('../errors/errors');

//  GET /cards — возвращает все карточки
const getCards = (req, res, next) => {
  Card.find()
    .populate(['owner', 'likes'])
    .then((cards) => {
      res.json({ data: cards });
    })
    .catch(next);
};

//  POST /cards — создаёт карточку
const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const userId = req.user._id;

  Card.create({ name, link, owner: userId })
    .then((card) => Card.findById(card._id).populate(['owner', 'likes']))
    .then((card) => {
      res.status(201).json({ data: card });
    })
    .catch(next);
};

//  DELETE /cards/:cardId — удаляет карточку по идентификатору
const deleteCard = (req, res, next) => {
  const { cardId } = req.params;

  Card.findById(cardId)
    .populate(['owner', 'likes'])
    .orFail(() => {
      throw new NotFoundError(`Card ${cardId} is not found`);
    })
    .then((card) => {
      if (card.owner._id.toString() === req.user._id.toString()) {
        Card.findByIdAndRemove(cardId)
          .orFail(() => {
            throw new NotFoundError(`Card ${cardId} is not found`);
          })
          .then(() => {
            res.json({
              message: `card with id: ${cardId} successfully deleted`,
            });
          });
        return;
      }
      throw new ForbiddenError(`You are not the owner Card: ID ${cardId}`);
    })
    .catch(next);
};

//  PUT /cards/:cardId/likes — поставить лайк карточке
const addLikeCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .populate(['owner', 'likes'])
    .orFail(() => {
      throw new NotFoundError(`Card ${cardId} is not found`);
    })
    .then((card) => {
      res.json({ data: card });
    })
    .catch(next);
};

//  DELETE /cards/:cardId/likes — убрать лайк с карточки
const deleteLikeCard = (req, res, next) => {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .populate(['owner', 'likes'])
    .orFail(() => {
      throw new NotFoundError(`Card ${cardId} is not found`);
    })
    .then((card) => {
      res.json({ data: card });
    })
    .catch(next);
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  addLikeCard,
  deleteLikeCard,
};
