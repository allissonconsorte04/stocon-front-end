import React, { useState, useEffect } from 'react';
import './modalClientes.css';
import api from '../../services/api';
import { Role } from '../../pages/roles/Roles';


interface ModalRolesProps {
  roleData: Role | null;
  fecharModal: () => void;
}

const ModalRoles: React.FC<ModalRolesProps> = ({
  roleData,
  fecharModal,
}) => {
  const [role, setRole] = useState<Role>({
    id: roleData?.id || undefined,
    name: '',
  });

  useEffect(() => {
    if (roleData) {
      setRole(roleData);
    }
  }, [roleData]);

  const handleSalvar = () => {
    if (role.id) {
      api
        .put(`/roles/${role.id}`, role)
        .then((response) => {
          console.log('Role Atualizado: ', response.data);
          fecharModal();
        })
        .catch((error) => {
          console.error('Erro ao atualizar role: ', error);
        });
    } else {
      api
        .post('/roles/', role)
        .then((response) => {
          console.log('Role criado: ', response.data);
          fecharModal();
        })
        .catch((error) => {
          console.error('Erro ao adicionar role: ', error);
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
              <label className="label">Nome</label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  placeholder="Nome"
                  value={role.name}
                  onChange={(e) =>
                    setRole({ ...role, name: e.target.value })
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
            Cancelar
          </button>
        </footer>
      </div>
    </div>
  );
};

export default ModalRoles;
