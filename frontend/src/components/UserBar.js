import React, { useContext } from 'react';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

const UserBar = ({ logOut }) => {
  const handleClick = () => {
    logOut();
  };
  const currentUser = useContext(CurrentUserContext);

  return (
    <div className="header__user-menu">
      <p className="header__user-info">{currentUser?.email}</p>
      <button className="header__button-exit" onClick={handleClick}>
        Выйти
      </button>
    </div>
  );
};

export default UserBar;
