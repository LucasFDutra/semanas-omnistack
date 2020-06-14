import React, { useState } from 'react';
import './Login.css';
import api from '../services/api';

import logo from '../assets/logo.svg';

const Login = ({ history }) => {
  const [username, setUsername] = useState('');

  const handleSubmit = async (env) => {
    env.preventDefault();

    const response = await api.post('/devs', {
      username,
    });

    const { _id } = response.data;

    history.push(`/dev/${_id}`);
  };

  return (
    <div className='login-container'>
      <form onSubmit={handleSubmit}>
        <img src={logo} alt='Tindev' />
        <input
          type='text'
          placeholder='digite seu usuário no github'
          value={username}
          onChange={evento => setUsername(evento.target.value)}
        />
        <button type='submit'>Enviar</button>
      </form>
    </div>
  );
};

export default Login;
