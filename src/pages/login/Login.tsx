import React, { useState } from 'react';
import './login.css';
import { Icon } from '@mdi/react';
import { mdiLock } from '@mdi/js';
import { AuthData } from '../../routes/AuthWrapper';

function Login() {
  const { login } = AuthData();
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    login(userName, password)
  };

  return (
    <div className="login-container">
      <div className="modal-card">
        <header className="modal-card-head" />
        <section className="modal-card-body">
          <div>
            <div className="field">
              <label className="label">E-mail</label>
              <div className="control has-icons-left">
                <input
                  className="input"
                  type="text"
                  placeholder="Digite aqui seu E-mail"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
                <span className="icon is-small is-left" style={{top: 4}}>
                  <i className="fas fa-envelope"></i>
                </span>
              </div>
            </div>

            <div className="field">
              <label className="label">Senha</label>
              <div className="control has-icons-left has-icons-right">
                <input
                  className="input"
                  type="password"
                  placeholder="Digite aqui sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span className="icon is-small is-left" style={{top: 4}}>
                  <Icon path={mdiLock} size={1} />
                </span>
              </div>
            </div>
          </div>
        </section>
        <footer className="modal-card-foot">
          <button className="btn is-success" onClick={handleLogin}>
            Entrar
          </button>
        </footer>
      </div>
    </div>
  );
}

export default Login;
