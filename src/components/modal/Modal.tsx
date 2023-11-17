import React, { useState } from 'react';
import './modal.css';
import { Icon } from '@mdi/react';
import { mdiLock } from '@mdi/js';
import axios from 'axios';

interface ModalProps {
  isOpen: boolean;
  closeModal: () => void;
  title: string;
  onSave?: () => void;
  onCancel?: () => void;
}

function Modal({ isOpen, closeModal, onSave, onCancel }: ModalProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    axios
      .post('http://localhost:3000/api/login/', {
        username: username,
        password: password,
      })
      .then((response) => {
        const { message, token } = response.data;

        if (message === 'Login bem-sucedido') {
          localStorage.setItem('token', token);
        }
        closeModal
      })
      .catch((error) => {
        console.log('Erro no login: ', error);
      });
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal is-active">
      <div className="modal-background" onClick={closeModal}></div>
      <div className="modal-card">
        <header className="modal-card-head">
          <button
            className="delete"
            aria-label="close"
            onClick={closeModal}
          ></button>
        </header>
        <section className="modal-card-body">
          <div>
            <div className="field">
              <label className="label">E-mail</label>
              <div className="control has-icons-left">
                <input
                  className="input"
                  type="text"
                  placeholder="Digite aqui seu E-mail"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
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
          {onSave && (
            <button className="btn is-success" onClick={handleLogin}>
              Entrar
            </button>
          )}
          {onCancel && (
            <button className="btn" onClick={onCancel}>
              Cancel
            </button>
          )}
        </footer>
      </div>
    </div>
  );
}

export default Modal;
