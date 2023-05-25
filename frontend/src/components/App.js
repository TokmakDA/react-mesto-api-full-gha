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

  // // Получаем первичные данные
  // useEffect(() => {
  //   console.log('useEffect => getInitialsData');

  //   api
  //     .getInitialsData()
  //     .then(([userInfo, initialCards]) => {
  //       console.log('getInitialsData => ', userInfo, initialCards);
  //       setCurrentUser(userInfo.data);
  //       setCurrentCards(initialCards.data);
  //     })
  //     .catch((err) => console.log('getInitialsData => err', err));
  // }, []);

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
  // обработчик открытия попапа с картинкой карточки
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
    setInfoTooltipOpen(false);
    setTimeout(() => setErrMessage(null), 1000);
  }, []);

  // сохраняем введенные данные пользователя в Api
  function handleUpdateUser(dataUser) {
    console.log('handleUpdateUser => patchUserInfo');

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
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }

  // сохраняем новый аватар пользователя в Api
  function handleUpdateAvatar(linkAvatar) {
    console.log('handleUpdateAvatar => patchUserAvatar');

    setLoading(true);
    api
      .patchUserAvatar(linkAvatar)
      .then((resUser) => {
        console.log('patchUserAvatar => ', resUser);
        setCurrentUser(resUser.data);
      })
      .then(() => closeAllPopups())
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }

  // добавляем новую карточку
  function handleAddPlaceSubmit(dataCard) {
    console.log('handleAddPlaceSubmit => postNewCard');

    setLoading(true);
    api
      .postNewCard(dataCard)
      .then((newCard) => {
        setCurrentCards([newCard.data, ...currentCards]);
      })
      .then(() => closeAllPopups())
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }

  // обработчик лайков и дизлайков
  function handleCardLike(card) {
    console.log('handleCardLike => ');

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
    console.log('handleCardDeleteSubmit => deleteCard');

    setLoading(true);
    api
      .deleteCard(card._id)
      .then((res) => {
        setCurrentCards((state) => state.filter((c) => c._id !== card._id));
        console.log(res.message);
      })
      .then(() => closeAllPopups())
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }

  const cbTokenCheck = useCallback(async () => {
    // console.log('cbTokenCheck => useCallback =>');

    try {
      setLoading(true);
      const jwt = Cookies.get('jwt');
      if (!jwt) {
        setLoggedIn(false);
        console.log('cbTokenCheck => try => !jwt ');

        throw new Error('Требуется авторизация');
      }
      const initialsData = await api.getInitialsData();
      if (initialsData) {
        // console.log(initialsData);
        // console.log('getInitialsData => ', initialsData[0], initialsData[1]);
        setCurrentUser(initialsData[0].data);
        setCurrentCards(initialsData[1].data);
        setLoggedIn(true);
        navigate('/');
      }
    } catch(err) {
      console.log(err.message)
      setLoggedIn(false);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    cbTokenCheck();
  }, [cbTokenCheck]);

  // Авторизация
  const cbLogin = ({ email, password }) => {
    console.log('cbLogin => authorize =>');

    setLoading(true);
    api
      .authorize({ email, password })
      .then((res) => {
        // console.log('cbLogin => auth.authorize => res.data', res.data);
        setCurrentUser(res.data);
        // console.log('cbLogin => auth.authorize =>  res.cookie', res.cookie);
        // console.log('cbLogin => auth.authorize => Cookies.get()', Cookies.get());
        // console.log('cbLogin => auth.authorize => Cookies.get(jwt)', Cookies.get('jwt'));
        cbTokenCheck();
        // res.token && localStorage.setItem('jwt', res.token);
        navigate('/');
        // setLoggedIn(true);
      })
      .catch((err) => {
        console.log('cbLogin => auth.authorize => err', err);
        setInfoTooltipOpen(true);
        setErrMessage(err.message);
        setInfoTooltip(false);
      })
      .finally(() => {
        setLoading(false);
        setLoggedIn(true);
      });
  };

  // Регистрация
  const cbRegister = ({ email, password }) => {
    console.log('cbRegister => register =>');

    setLoading(true);
    api
      .register({ email, password })
      .then((res) => {
        console.log('cbRegister => auth.register => res', res);
        console.log('cbRegister => auth.register => res.data', res?.data);
        setInfoTooltip(true);
      })
      .catch((err) => {
        console.log('cbRegister => auth.register => err', err);
        setErrMessage(err.message);
        setInfoTooltip(false);
      })
      .finally(() => {
        setInfoTooltipOpen(true);
        setLoading(false);
      });
  };

  // Выход
  const cbLogOut = () => {
    console.log('cbLogOut => getSignout =>');

    setLoading(true);
    // localStorage.removeItem('jwt');
    api
      .getSignout()
      .then((res) => {
        console.log('cbLogOut => auth.getSignout => res', res);
        console.log('cbLogOut => getSignout => Cookies.get(jwt)', Cookies.get('jwt'));
        setLoggedIn(false);
      })
      .catch((err) => {
        console.log('cbLogOut => auth.getSignout => err', err);
        setInfoTooltip(false);
      })
      .finally(() => {
        setLoading(false);
        navigate('/sign-in');
      });
  };

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <Header logOut={cbLogOut} isLoggedIn={isLoggedIn} />
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
        onClose={closeAllPopups}
        isInfoTooltip={isInfoTooltip}
        errMessage={errMessage}
      />

      <Loading isLoading={isLoading} />
    </CurrentUserContext.Provider>
  );
}

export default App;
