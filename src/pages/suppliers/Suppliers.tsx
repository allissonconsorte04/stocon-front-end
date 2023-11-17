import { useEffect, useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

import './suppliers.css'; // Certifique-se de ter o arquivo de estilo adequado
import ModalSuppliers from '../../components/modal/ModalSuppliers';
import api from '../../services/api';

export interface Supplier {
  id?: number;
  name: string;
  description: string;
  phone: string;
  email: string;
}

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [supplierParaEditar, setSupplierParaEditar] = useState<Supplier | null>(
    null
  );

  useEffect(() => {
    getAllSuppliers();
  }, []);

  const getAllSuppliers = () => {
    api
      .get('/suppliers')
      .then((response) => {
        setSuppliers(response.data);
      })
      .catch((error) => {
        console.error('Erro ao obter suppliers:', error);
      });
  };

  const handleEditarSupplier = (supplier: Supplier) => {
    setSupplierParaEditar(supplier);
    setModalVisible(true);
  };

  const handleRemoveSupplier = (supplier: Supplier) => {
    api
      .delete(`/suppliers/${supplier.id}`)
      .then((response) => {
        console.log('Supplier deletado: ', response.data);
        fecharModal();
      })
      .catch((error) => {
        console.error('Erro ao deletar supplier: ', error);
      });
  };

  const fecharModal = () => {
    setModalVisible(false);
    setSupplierParaEditar(null);
    getAllSuppliers();
  };

  return (
    <div className="suppliers-container">
      <div className="add-supplier-container">
        <button
          className="btn btn-add-supplier"
          onClick={() => handleEditarSupplier({ name: '', description: '', phone: '', email: ''})}
        >
          Adicionar Supplier +
        </button>
      </div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Descrição</th>
            <th>Telefone</th>
            <th>E-mail</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.map((supplier) => (
            <tr key={supplier.id}>
              <td className="id-columns">{supplier.id}</td>
              <td>{supplier.name}</td>
              <td>{supplier.description}</td>
              <td>{supplier.phone}</td>
              <td>{supplier.email}</td>
              <td className="actions-columns">
                <div style={{ justifyContent: 'center', display: 'flex' }}>
                  <button
                    className="btn-edit btn"
                    onClick={() => handleEditarSupplier(supplier)}
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button
                    className="btn btn-remove"
                    onClick={() => handleRemoveSupplier(supplier)}
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
        <ModalSuppliers
          supplierData={supplierParaEditar}
          fecharModal={fecharModal}
        />
      )}
    </div>
  );
};

export default Suppliers;
