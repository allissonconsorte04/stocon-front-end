import React, { useState, useEffect } from 'react';
import './modalClientes.css';
import api from '../../services/api';
import { Category } from '../../pages/categories/Categories';


interface ModalCategoriesProps {
  categoryData: Category | null;
  fecharModal: () => void;
}

const ModalCategories: React.FC<ModalCategoriesProps> = ({
  categoryData,
  fecharModal,
}) => {
  const [category, setCategory] = useState<Category>({
    id: categoryData?.id || undefined,
    name: '',
    description: '',
  });

  useEffect(() => {
    if (categoryData) {
      setCategory(categoryData);
    }
  }, [categoryData]);

  const handleSalvar = () => {
    if (category.id) {
      api
        .put(`/categories/${category.id}`, category)
        .then((response) => {
          console.log('Category Atualizado: ', response.data);
          fecharModal();
        })
        .catch((error) => {
          console.error('Erro ao atualizar category: ', error);
        });
    } else {
      api
        .post('/categories/', category)
        .then((response) => {
          console.log('Category criado: ', response.data);
          fecharModal();
        })
        .catch((error) => {
          console.error('Erro ao adicionar category: ', error);
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
                  value={category.name}
                  onChange={(e) =>
                    setCategory({ ...category, name: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="field">
              <label className="label">Descrição</label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  placeholder="Descrição"
                  value={category.description}
                  onChange={(e) =>
                    setCategory({
                      ...category,
                      description: e.target.value,
                    })
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

export default ModalCategories;
