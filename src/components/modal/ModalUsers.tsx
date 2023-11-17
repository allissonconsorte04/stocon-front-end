import React, { useState, useEffect } from 'react';
import './modal.css';
import api from '../../services/api';
import { User } from '../../pages/users/Users';

export interface ModalUsersProps {
  userData: User | null; // Declare a prop como User | null
  fecharModal: () => void;
}

const ModalUsers: React.FC<ModalUsersProps> = ({
  userData,
  fecharModal,
}) => {
  const [user, setUser] = useState<User>({
    id: userData?.id || undefined,
    email: '',
    first_name: '',
    last_name: '',
  });

  useEffect(() => {
    if (userData) {
      setUser(userData); // Atualize o estado apenas se userData não for nulo
    }
  }, [userData]);

  const handleSalvar = () => {
      if (user.id) {
        api
          .put(`/users/${user.id}`, user)
          .then((response) => {
            console.log('User Atualizado: ', response.data);
            fecharModal();
          })
          .catch((error) => {
            console.error('Erro ao atualizar user: ', error);
          });
      } else {
        api
          .post('/users/', user)
          .then((response) => {
            console.log('User criado: ', response.data);
            fecharModal();
          })
          .catch((error) => {
            console.error('Erro ao adicionar user: ', error);
          });
      }
  };

  return (
    <div className="modal is-active">
      <div className="modal-background" onClick={fecharModal}></div>
      <div className="modal-card">
        <header className="modal-card-head">
          <button
            className="delete"
            aria-label="close"
            onClick={fecharModal}
          ></button>
        </header>
        <section className="modal-card-body">
          <div>
          <div className="field">
              <label className="label">E-mail</label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  placeholder="Email"
                  value={user.email}
                  onChange={(e) =>
                    setUser({ ...user, email: e.target.value })
                  }
                />
              </div>
            </div>
            {!user.id && (<div className="field">
              <label className="label">Senha</label>
              <div className="control">
                <input
                  className="input"
                  type="password"
                  placeholder="Senha"
                  value={user.password}
                  onChange={(e) =>
                    setUser({ ...user, password: e.target.value })
                  }
                />
              </div>
            </div>)}
            <div className="field">
              <label className="label">Nome</label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  placeholder="Nome"
                  value={user.first_name}
                  onChange={(e) =>
                    setUser({ ...user, first_name: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="field">
              <label className="label">Sobrenome</label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  placeholder="Sobrenome"
                  value={user.last_name}
                  onChange={(e) =>
                    setUser({ ...user, last_name: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
        </section>
        <footer className="modal-card-foot">
          <button className="btn is-success" onClick={handleSalvar}>
            Salvar
          </button>
          <button className="btn" onClick={fecharModal}>
            Cancel
          </button>
        </footer>
      </div>
    </div>
  );
};

export default ModalUsers;
