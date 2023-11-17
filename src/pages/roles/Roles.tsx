import { useEffect, useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

import './roles.css'; // Certifique-se de ter o arquivo de estilo adequado
import api from '../../services/api';
import ModalRoles from '../../components/modal/ModalRoles';

export interface Role {
  id?: number;
  name: string;
}

const Roles = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [roleParaEditar, setRoleParaEditar] = useState<Role | null>(
    null
  );

  useEffect(() => {
    getAllRoles();
  }, []);

  const getAllRoles = () => {
    api
      .get('/roles')
      .then((response) => {
        setRoles(response.data);
      })
      .catch((error) => {
        console.error('Erro ao obter roles:', error);
      });
  };

  const handleEditarRole = (role: Role) => {
    setRoleParaEditar(role);
    setModalVisible(true);
  };

  const handleRemoveRole = (role: Role) => {
    api
      .delete(`/roles/${role.id}`)
      .then((response) => {
        console.log('Role deletado: ', response.data);
        fecharModal();
      })
      .catch((error) => {
        console.error('Erro ao deletar role: ', error);
      });
  };

  const fecharModal = () => {
    setModalVisible(false);
    setRoleParaEditar(null);
    getAllRoles();
  };

  return (
    <div className="roles-container">
      <div className="add-role-container">
        <button
          className="btn btn-add-role"
          onClick={() => handleEditarRole({ name: ''})}
        >
          Adicionar Permissão +
        </button>
      </div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((role) => (
            <tr key={role.id}>
              <td className="id-columns">{role.id}</td>
              <td>{role.name}</td>
              <td className="actions-columns">
                <div style={{ justifyContent: 'center', display: 'flex' }}>
                  <button
                    className="btn-edit btn"
                    onClick={() => handleEditarRole(role)}
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button
                    className="btn btn-remove"
                    onClick={() => handleRemoveRole(role)}
                  >
                    <FontAwesomeIcon icon={faTrashAlt} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isModalVisible && (
        <ModalRoles
          roleData={roleParaEditar}
          fecharModal={fecharModal}
        />
      )}
    </div>
  );
};

export default Roles;
