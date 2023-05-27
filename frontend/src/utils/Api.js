class Api {
  constructor(options) {
    this._baseUrl = options.baseUrl;
    this._headers = options.headers;
    this._credentials = options.credentials;
  }

  _checkResponse = async (res) => {
    // res.ok
    //   ? res.json()
    //   : Promise.reject(`Ошибка: ${res.status} , ${res.statusText}`);
    if (res.ok) {
      return await res.json();
    } else {
      try {
        const err = await res.json();
        console.log('_checkResponse => !res.ok => err =>', err);
        if (err.validation) {
          console.log(
            '_checkResponse => !res.ok => err => err.validation',
            err.validation,
          );
          throw new Error(err.validation.body.message ?? err.message);
        } else if (err.message) {
          console.log(
            '_checkResponse => !res.ok => err => err.message',
            err.message,
          );
          throw new Error(err.message);
        } else {
          console.log('_checkResponse => !res.ok => err => else =>', err);
          throw new Error('Неизвестная ошибка');
        }
      } catch (e) {
        return Promise.reject(e);
      }
    }
  };

  _makeRequest(url, method, body) {
    const token = localStorage.getItem('jwt');
    if (token !== undefined) {
      this._headers['Authorization'] = `${token}`;
    }

    const config = {
      method,
      credentials: this._credentials,
      headers: this._headers,
    };

    if (body !== undefined) {
      config.body = JSON.stringify(body);
    }

    return fetch(`${this._baseUrl}${url}`, config).then(this._checkResponse);
  }

  //Загрузка информации о пользователе с сервера
  // запрос GET
  getUserInfo() {
    return this._makeRequest('/users/me', 'GET');
  }

  // Загрузка карточек с сервера
  // запрос GET
  getInitialCards() {
    return this._makeRequest('/cards', 'GET');
  }

  // Редактирование профиля (Данные уходят на сервер)
  patchUserInfo(user) {
    return this._makeRequest('/users/me', 'PATCH', {
      name: user.name,
      about: user.about,
    });
  }

  // Добавление новой карточки. полученный ответ нужно отрендерить на страницу
  // запрос POST
  postNewCard(card) {
    return this._makeRequest('/cards', 'POST', {
      name: `${card.name}`,
      link: `${card.link}`,
    });
  }

  // Удаление карточки
  // DELETE-запрос:
  deleteCard(cardID) {
    return this._makeRequest(`/cards/${cardID}`, 'DELETE');
  }

  // Постановка  лайка
  // Чтобы лайкнуть карточку, отправьте PUT-запрос:
  addLikeCard(cardID) {
    return this._makeRequest(`/cards/${cardID}/likes`, 'PUT');
  }

  // Cнятие лайка
  // Чтобы убрать лайк, нужно отправить DELETE-запрос:
  deleteLikeCard(cardID) {
    return this._makeRequest(`/cards/${cardID}/likes`, 'DELETE');
  }

  // Обновление аватара пользователя (Данные уходят на сервер)
  // Запрос PATCH
  patchUserAvatar(linkAvatar) {
    return this._makeRequest(`/users/me/avatar`, 'PATCH', {
      avatar: linkAvatar,
    });
  }

  // Регистрация
  register = ({ email, password }) => {
    return this._makeRequest('/signup', 'POST', { email, password });
  };

  // Авторизация
  authorize = ({ email, password }) => {
    return this._makeRequest('/signin', 'POST', { email, password });
  };

  // Чекаем токен
  getContent = () => {
    return this._makeRequest('/users/me', 'GET');
  };

  // Выход
  getSignout = () => {
    return this._makeRequest('/signout', 'GET');
  };

  // закгружаем первичную информацию с сервера
  getInitialsData() {
    return Promise.all([this.getUserInfo(), this.getInitialCards()]);
  }
}

const config = {
  // baseUrl: 'https://api.tokmak-da.mesto.nomoredomains.rocks',
  baseUrl: 'http://localhost:3000',
  credentials: 'include',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
};

const api = new Api(config);

export default api;
