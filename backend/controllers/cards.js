const Card = require('../models/card');
const { ForbiddenError, NotFoundError } = require('../errors/errors');

// Внести изменения в данных пользователя из базы по ID
const setFindByIdAndUpdate = async (id, update) => {
  const card = await Card.findByIdAndUpdate(id, update, {
    new: true,
  })
    .populate(['owner', 'likes'])
    .orFail(() => {
      throw new NotFoundError(`Карточка ${id} не найдена`);
    });
  return card;
};

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

  Card.create({ name, link, owner: req.user._id })
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
      throw new NotFoundError(`Карточка ${cardId} не найдена`);
    })
    .then((card) => {
      if (card.owner._id.toString() === req.user._id.toString()) {
        console.log('deleteCard => card =   return card.deleteOne()');
        return card.deleteOne().then(() => {
          res.json({
            message: `Карточка с id: ${cardId} успешно удалена`,
          });
        });
      }
      throw new ForbiddenError(
        `Вы не являетесь владельцем карточки id: ${cardId}`,
      );
    })
    .catch(next);
};

//  PUT /cards/:cardId/likes — поставить лайк карточке
const addLikeCard = (req, res, next) => {
  const { cardId } = req.params;
  // добавить _id в массив, если его там нет
  setFindByIdAndUpdate(cardId, { $addToSet: { likes: req.user._id } })
    .then((card) => {
      res.json({ data: card });
    })
    .catch(next);
};

//  DELETE /cards/:cardId/likes — убрать лайк с карточки
const deleteLikeCard = (req, res, next) => {
  const { cardId } = req.params;
  // убрать _id из массива
  setFindByIdAndUpdate(cardId, { $pull: { likes: req.user._id } })
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
