import { useEffect, useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

import './categories.css'; // Certifique-se de ter o arquivo de estilo adequado
import api from '../../services/api';
import ModalCategories from '../../components/modal/ModalCategories';

export interface Category {
  id?: number;
  name: string;
  description: string;
}

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [categoryParaEditar, setCategoryParaEditar] = useState<Category | null>(
    null
  );

  useEffect(() => {
    getAllCategories();
  }, []);

  const getAllCategories = () => {
    api
      .get('/categories')
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.error('Erro ao obter categories:', error);
      });
  };

  const handleEditarCategory = (category: Category) => {
    setCategoryParaEditar(category);
    setModalVisible(true);
  };

  const handleRemoveCategory = (category: Category) => {
    api
      .delete(`/categories/${category.id}`)
      .then((response) => {
        console.log('Category deletado: ', response.data);
        fecharModal();
      })
      .catch((error) => {
        console.error('Erro ao deletar category: ', error);
      });
  };

  const fecharModal = () => {
    setModalVisible(false);
    setCategoryParaEditar(null);
    getAllCategories();
  };

  return (
    <div className="categories-container">
      <div className="add-category-container">
        <button
          className="btn btn-add-category"
          onClick={() => handleEditarCategory({ name: '', description: ''})}
        >
          Adicionar Categoria +
        </button>
      </div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Descrição</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id}>
              <td className="id-columns">{category.id}</td>
              <td>{category.name}</td>
              <td>{category.description}</td>
              <td className="actions-columns">
                <div style={{ justifyContent: 'center', display: 'flex' }}>
                  <button
                    className="btn-edit btn"
                    onClick={() => handleEditarCategory(category)}
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button
                    className="btn btn-remove"
                    onClick={() => handleRemoveCategory(category)}
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
        <ModalCategories
          categoryData={categoryParaEditar}
          fecharModal={fecharModal}
        />
      )}
    </div>
  );
};

export default Categories;
