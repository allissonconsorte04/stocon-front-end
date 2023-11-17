import { useEffect, useState } from 'react';

import './users.css';
import ModalUsers from '../../components/modal/ModalUsers';
import api from '../../services/api';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

export interface User {
  id?: number;
  password?: string;
  email: string;
  first_name: string;
  last_name: string;
}

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [userParaEditar, setUserParaEditar] = useState<User | null>(
    null
  );

  useEffect(() => {
    getAllUsers();
  }, []);

  const getAllUsers = () => {
    api
      .get('/users')
      .then((response) => {
        console.log('users -> ', response.data)
        setUsers(response.data);
      })
      .catch((error) => {
        console.error('Erro ao obter users:', error);
      });
  };

  const handleEditarUser = (user: User) => {
    setUserParaEditar(user);
    setModalVisible(true);
  };

  const handleRemoveUser = (user: User) => {
    api
      .delete(`/users/${user.id}`)
      .then((response) => {
        console.log('User deletado: ', response.data);
        fecharModal();
      })
      .catch((error) => {
        console.error('Erro ao deletar user: ', error);
      });
  };

  const fecharModal = () => {
    setModalVisible(false);
    setUserParaEditar(null);
    getAllUsers();
  };

  return (
    <div className="users-container">
      <div className="add-user-container">
        <button
          className="btn btn-add-user"
          onClick={() =>
            handleEditarUser({ email: '', first_name: '', last_name: ''})
          }
        >
          Adicionar User +
        </button>
      </div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>E-mail</th>
            <th>Nome</th>
            <th>Sobrenome</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className='id-columns'>{user.id}</td>
              <td>{user.email}</td>
              <td>{user.first_name}</td>
              <td>{user.last_name}</td>
              <td className='actions-columns'>
                <div style={{ justifyContent: 'center', display: 'flex' }}>
                  <button
                    className="btn-edit btn"
                    onClick={() => handleEditarUser(user)}
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button
                    className="btn btn-remove"
                    onClick={() => handleRemoveUser(user)}
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
        <ModalUsers
          userData={userParaEditar}
          fecharModal={fecharModal}
        />
      )}
    </div>
  );
};

export default Users;
