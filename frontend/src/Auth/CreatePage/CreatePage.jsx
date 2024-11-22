import React, { useState } from 'react';
import classes from './CreatePage.module.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import validator from 'validator';
import axios from 'axios'

const CreatePage = () => {
  const [userName, setUserName] = useState('')
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('')
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const location = useLocation();
  const navigate = useNavigate()

  const handleUserNameChange = (e) => {
    setUserName(e.target.value)
    clearError()
  }

  const handleMailChange = (e) => {
    setEmail(e.target.value);
    clearError();
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    clearError();
  };

  const handleUserNameClear = () => {
    setUserName('');  
  };

  const handleMailClear = () => {
    setEmail('');  
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const clearError = () => {
    setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userName || !email || !password ) {
      setErrorMessage('Пожалуйста, заполните все поля')
    } else if (!validator.isEmail(email)) { 
      setErrorMessage('Электронная почта введена некорректно');
      return; 
    } else if (password.length < 8) { 
      setErrorMessage('Длина пароля должна быть не менее 8 символом');
      return; 
    } 

    try {
      const response = await axios.post('/api/create', {
        userName,
        email,
        password,
      });

      if (response.status === 201) { 
        setRegistrationSuccess(true);
        setTimeout(() => {
          navigate('/login')
        }, 2000)
      } else { 
        setErrorMessage('Неизвестная ошибка при регистрации. Попробуйте позже.'); 
      }

    } catch (error) {
      console.error(error);
      if (error.response) { 
        const serverErrorMessage = error.response.data.message || 'Ошибка сервера';  
        setErrorMessage(serverErrorMessage); 
      } else if (error.request) { 
        setErrorMessage('Ошибка сети. Проверьте соединение.');
      } else { 
        setErrorMessage('Ошибка запроса.');
      }
    }
  };

  return (
    <body className={location.pathname === '/create' ? '' : 'overflow-hidden'}>
    <div className={classes.backImage}>
      <div className={classes.inputContainer} >
      <h1 className={classes.brandName}>STORE</h1>

        <div className={classes.emailInput}>
          <input
            value={userName}
            type="text"
            placeholder="Имя"
            onChange={handleUserNameChange}
            className={classes.inputField} />
          {userName ? (<span className={classes.clearIcon} onClick={handleUserNameClear}>×</span>) : null}
        </div>

        <div className={classes.emailInput}>
          <input
            value={email}
            type="text"
            placeholder="Электронная почта"
            onChange={handleMailChange}
            className={classes.inputField} />
          {email ? (<span className={classes.clearIcon} onClick={handleMailClear}>×</span>) : null}
        </div>

        <div className={classes.passwordInput}>
          <input
            value={password}
            type={showPassword ? 'text' : 'password'}
            placeholder="Пароль"
            onChange={handlePasswordChange}
            className={classes.inputField} />
          {password ? (<span className={classes.showPasswordIcon} onClick={togglePasswordVisibility}>
            {showPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />} </span>) : null}
        </div>


        {errorMessage && <div className={classes.errorMessage}>{errorMessage}</div>} 

        {registrationSuccess && ( 
            <div className={classes.successMessage}>Вы успешно зарегистрировались!</div>
          )}

        <button onClick={handleSubmit} className={classes.createAccount} style={{ marginTop: errorMessage ? '15px' : '30px' }}>Создать аккаунт</button>
        
        <Link to="/" className={classes.enter}>Войти</Link>
      </div>
    </div></body>
  );
};

export default CreatePage;