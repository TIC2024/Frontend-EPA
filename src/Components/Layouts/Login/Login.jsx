import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    fetch('http://localhost:5000/api/authenticate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + btoa(username + ':' + password) 
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.authenticated) {
            Swal.fire({
                icon: 'success',
                title: '¡Inicio de sesión exitoso!',
                text: 'Bienvenido.'
            });
            navigate(`/home/`);
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Inicio de sesión fallido',
                text: 'Verifica tus credenciales e intenta de nuevo.'
            });
        }
    })
    .catch(error => {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al comunicarse con el servidor'
        });
    });
};

  return (
    <div className="login-container">
      <div className="logo-container">
        <img src="https://www.epa.gov.co/images/imagenes/LOGO_EPA.png" alt="Logo" />
      </div>
      <div className="input-container">
        <label htmlFor="username">Login Usuario</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="off"
        />
      </div>
      <div className="password-container">
        <label htmlFor="password">Contraseña</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="off"
        />
      </div>
      <div>
        <button className="login-btn" onClick={handleLogin}>
          Ingresar
        </button>
      </div>
    </div>
  );
}

export default Login;
