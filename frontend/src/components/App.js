import React, { useCallback, useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

import '../index.css';
import Header from './Header';
import Footer from './Footer';
import Main from './Main';
// import PopupWithForm from './PopupWithForm';
import ImagePopup from './ImagePopup';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import api from '../utils/Api';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import CardDeletePopup from './DeleteCardPopup';
import ProtectedRoute from './ProtectedRoute';
import Register from './Register';
import Login from './Login';
import InfoTooltip from './InfoTooltip';
import Loading from './Loading';

function App() {
  // Стейты состояния открытия попапов
  const [isEditAvatarPopupOpen, setEditAvatarPopupOpen] = useState(false);
  const [isEditProfilePopupOpen, setEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setAddPlacePopupOpen] = useState(false);
  const [isImagePopupOpen, setImagePopupOpen] = useState(false);
  const [isCardDeletePopupOpen, setCardDeletePopupOpen] = useState(false);
  const [isInfoTooltipOpen, setInfoTooltipOpen] = useState(false);

  // Стейт результат обработки api Auth: OK=true, error=false
  const [isInfoTooltip, setInfoTooltip] = useState(false);
  // Стейт массива карточек
  const [currentCards, setCurrentCards] = useState([]);
  // Стейт карточки для удаления
  const [currentCard, setCurrentCard] = useState(null);
  // Стейт данных пользователя
  const [currentUser, setCurrentUser] = useState(null);
  // Стейт ожидания загрузки
  const [isLoading, setLoading] = useState(false);
  // Стейт Сообщения об ошибке
  const [errMessage, setErrMessage] = useState(null);

  // Стейт авторизации на сайте
  const [isLoggedIn, setLoggedIn] = useState(false);

  const navigate = useNavigate();

  // Информационное окно
  const openInfoTooltip = (err) => {
    setInfoTooltipOpen(true);
    if (err) {
      console.log('showError => err', err);
      setErrMessage(err.message);
      setInfoTooltip(false);
    } else {
      setInfoTooltip(true);
    }
  };

  // Закрыть Информационное окно
  const closeInfoTooltip = useCallback(() => {
    console.log('closeInfoTooltip => err');
    setTimeout(() => setErrMessage(null), 1000);
    setInfoTooltipOpen(false);
  }, []);

  // Обработчики открытия попапов
  function handleEditAvatarClick() {
    setEditAvatarPopupOpen(true);
  }
  function handleEditProfileClick() {
    setEditProfilePopupOpen(true);
  }
  function handleAddPlaceClick() {
    setAddPlacePopupOpen(true);
  }
  function handleCardDeleteClick(card) {
    setCurrentCard(card);
    setCardDeletePopupOpen(true);
  }

  // обработчик открытия попапа с картинкой карточки
  function handleCardClick(card) {
    setCurrentCard(card);
    setImagePopupOpen(true);
  }
  // обработчик закрытия попапа с картинкой карточки
  function closseImagepopup() {
    setCurrentCard(null);
    setImagePopupOpen(false);
  }

  // Отбработчик закрытия попапов
  const closeAllPopups = useCallback(() => {
    setEditAvatarPopupOpen(false);
    setEditProfilePopupOpen(false);
    setAddPlacePopupOpen(false);
    closseImagepopup();
    setCardDeletePopupOpen(false);
  }, []);

  // сохраняем введенные данные пользователя в Api
  function handleUpdateUser(dataUser) {
    setLoading(true);
    api
      .patchUserInfo(dataUser)
      .then((resUser) => {
        console.log('patchUserInfo => ', resUser);
        setCurrentUser(resUser.data);
      })
      .then(() => {
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
        openInfoTooltip(err);
      })
      .finally(() => setLoading(false));
  }

  // сохраняем новый аватар пользователя в Api
  function handleUpdateAvatar(linkAvatar) {
    setLoading(true);
    api
      .patchUserAvatar(linkAvatar)
      .then((resUser) => {
        console.log('patchUserAvatar => ', resUser);
        setCurrentUser(resUser.data);
      })
      .then(() => closeAllPopups())
      .catch((err) => {
        console.log(err);
        openInfoTooltip(err);
      })
      .finally(() => setLoading(false));
  }

  // добавляем новую карточку
  function handleAddPlaceSubmit(dataCard) {
    setLoading(true);
    api
      .postNewCard(dataCard)
      .then((newCard) => {
        setCurrentCards([newCard.data, ...currentCards]);
      })
      .then(() => closeAllPopups())
      .catch((err) => {
        console.log(err);
        openInfoTooltip(err);
      })
      .finally(() => setLoading(false));
  }

  // обработчик лайков и дизлайков
  function handleCardLike(card) {
    // Снова проверяем, есть ли уже лайк на этой карточке
    const isLiked = card.likes.some((i) => i._id === currentUser._id);
    // Отправляем запрос в API и получаем обновлённые данные карточки
    (!isLiked ? api.addLikeCard(card._id) : api.deleteLikeCard(card._id))
      .then((newCard) => {
        console.log(
          'handleCardLike => !isLiked =>',
          !isLiked ? 'addLikeCard =>' : 'deleteLikeCard =>',
          newCard,
        );
        setCurrentCards((state) =>
          state.map((c) => (c._id === card._id ? newCard.data : c)),
        );
      })
      .catch((err) => console.log(err));
  }

  // обработчик удаления карточки
  function handleCardDeleteSubmit(card) {
    setLoading(true);
    api
      .deleteCard(card._id)
      .then((res) => {
        setCurrentCards((state) => state.filter((c) => c._id !== card._id));
        console.log(res.message);
      })
      .then(() => closeAllPopups())
      .catch((err) => {
        console.log(err);
        openInfoTooltip(err);
      })
      .finally(() => setLoading(false));
  }

  // // Получение списка карточек
  // const initialCards = useCallback(async () => {
  //   setLoading(true);
  //   try {
  //     const allCards = await api.getInitialCards();
  //     if (allCards.data) {
  //       setCurrentCards(allCards.data);
  //     }
  //   } catch (err) {
  //     console.log(err.message);
  //     setLoggedIn(false);
  //   }
  // }, [currentCards]);

  // Авторизация
  const cbLogin = ({ email, password }) => {
    setLoading(true);
    api
      .authorize({ email, password })
      .then((res) => {
        setCurrentUser(res.data);
        navigate('/');
        setLoggedIn(true);
      })
      .catch((err) => {
        console.log('cbLogin => auth.authorize => err', err);
        openInfoTooltip(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Регистрация
  const cbRegister = ({ email, password }) => {
    console.log('cbRegister => register =>');

    setLoading(true);
    api
      .register({ email, password })
      .then((res) => {
        navigate('/sign-in');
        openInfoTooltip();
      })
      .catch((err) => {
        console.log('cbRegister => auth.register => err', err);
        openInfoTooltip(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const cbTokenCheck = useCallback(async () => {
    try {
      setLoading(true);
      const jwt = Cookies.get();
      console.log('cbTokenCheck => jwt', jwt);

      if (!jwt) {
        setLoggedIn(false);
        console.log('cbTokenCheck => !jwt ');
        throw new Error('Требуется авторизация');
      }
      const initialsData = await api.getInitialsData();
      if (initialsData) {
        setCurrentUser(initialsData[0].data);
        setCurrentCards(initialsData[1].data);
        setLoggedIn(true);
        navigate('/');
      }
    } catch (err) {
      console.log(err.message);
      setLoggedIn(false);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    cbTokenCheck();
  }, [cbTokenCheck]);

  // Выход
  const cbLogOut = () => {
    setLoading(true);
    api
      .getSignout()
      .then((res) => {
        console.log('cbLogOut => getSignout => res', res);
        setLoggedIn(false);
      })
      .catch((err) => {
        console.log('cbLogOut => auth.getSignout => err', err);
        openInfoTooltip(err);
      })
      .finally(() => {
        setLoading(false);
        navigate('/sign-in');
      });
  };

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <Header
        logOut={cbLogOut}
        isLoggedIn={isLoggedIn}
      />
      <Routes>
        <Route
          index
          path="/"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Main
                cards={currentCards}
                onEditAvatar={() => handleEditAvatarClick()}
                onEditProfile={() => handleEditProfileClick()}
                onAddPlace={() => handleAddPlaceClick()}
                onCardClick={handleCardClick}
                onCardLike={(card) => handleCardLike(card)}
                onCardDelete={(card) => handleCardDeleteClick(card)}
              />
              <Footer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sign-up"
          element={
            <Register
              isLoggedIn={isLoggedIn}
              onRegister={cbRegister}
              isLoading={isLoading}
              replace
            />
          }
        />
        <Route
          path="/sign-in"
          element={
            <Login
              isLoggedIn={isLoggedIn}
              onLogin={cbLogin}
              isLoading={isLoading}
              replace
            />
          }
        />
      </Routes>

      <EditAvatarPopup
        isOpen={isEditAvatarPopupOpen}
        onClose={closeAllPopups}
        onUpdateAvatar={(dataUser) => handleUpdateAvatar(dataUser)}
        isLoading={isLoading}
      />

      <EditProfilePopup
        isOpen={isEditProfilePopupOpen}
        onClose={closeAllPopups}
        onUpdateUser={(dataUser) => handleUpdateUser(dataUser)}
        isLoading={isLoading}
      />

      <AddPlacePopup
        isOpen={isAddPlacePopupOpen}
        onClose={closeAllPopups}
        onAddPlace={(dataNewCard) => handleAddPlaceSubmit(dataNewCard)}
        isLoading={isLoading}
      />

      <ImagePopup
        card={currentCard}
        isOpen={isImagePopupOpen}
        onClose={closeAllPopups}
      />

      <CardDeletePopup
        isOpen={isCardDeletePopupOpen}
        onClose={closeAllPopups}
        onCardDelete={(card) => handleCardDeleteSubmit(card)}
        isLoading={isLoading}
        card={currentCard}
      />

      <InfoTooltip
        isOpen={isInfoTooltipOpen}
        onClose={closeInfoTooltip}
        isInfoTooltip={isInfoTooltip}
        errMessage={errMessage}
      />

      <Loading isLoading={isLoading} />
    </CurrentUserContext.Provider>
  );
}

export default App;
