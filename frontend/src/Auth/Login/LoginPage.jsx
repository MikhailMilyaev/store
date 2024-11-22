import React, { useState } from 'react';
import classes from './LoginPage.module.css';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import validator from 'validator';
import axios from 'axios';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const clearError = () => {
    setErrorMessage('');
  };

  const handleMailChange = (e) => {
    setEmail(e.target.value);
    clearError();
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    clearError();
  };

  const handleMailClear = () => {
    setEmail('');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setErrorMessage('Пожалуйста, заполните все поля!');
      return;
    }

    if (!validator.isEmail(email)) {
      setErrorMessage('Данные введены некорректно');
      return;
    }

    if (password.length < 8) {
      setErrorMessage('Данные введены некорректно');
      return;
    }

    try {
      const response = await axios.post('/api/login', {
          email,
          password,
      });

      const token = response.data.token;
      localStorage.setItem('token', token);
      navigate('/itemslist');

  } catch (error) {
      if (error.response) {
        let serverErrorMessage = 'Ошибка сервера.';
        if (error.response.status === 401) {
            serverErrorMessage = 'Неверный логин или пароль.';
         } else if (error.response.data && error.response.data.message) {
              serverErrorMessage = error.response.data.message;  
        }
         setErrorMessage(serverErrorMessage);
      } else if (error.request) {
          setErrorMessage('Ошибка сети. Проверьте подключение.');
      } else {
          setErrorMessage('Ошибка запроса.');
      }
    }}



  return (
    <body className={location.pathname === '/login' ? '' : 'overflow-hidden'}>
      <div className={classes.backImage}>
        <div className={classes.inputContainer} >
          <h1 className={classes.brandName}>STORE</h1>
          <div className={classes.emailInput}>
            <input
              value={email}
              type="text"
              placeholder="Электронная почта"
              onChange={handleMailChange}
              className={classes.inputField}
            />
            {email ? (
              <span className={classes.clearIcon} onClick={handleMailClear}>
                ×
              </span>
            ) : null}
          </div>

          <div className={classes.passwordInput}>
            <input
              value={password}
              type={showPassword ? 'text' : 'password'}
              placeholder="Пароль"
              onChange={handlePasswordChange}
              className={classes.inputField}
            />
            {password ? (
              <span
                className={classes.showPasswordIcon}
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
              </span>
            ) : null}
          </div>

          {errorMessage && (
            <div className={classes.errorMessage}>{errorMessage}</div>
          )}

          <button onClick={handleSubmit} className={classes.enter}>
            Войти
          </button>

          <Link to="/create" className={classes.createAccount}>
            {' '}
            Создать аккаунт
          </Link>
        </div>
      </div>
    </body>
  );
};

export default LoginPage;