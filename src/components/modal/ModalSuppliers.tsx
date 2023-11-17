import React, { useState, useEffect } from 'react';
import './modalClientes.css';
import api from '../../services/api';
import { Supplier } from '../../pages/suppliers/Suppliers';


interface ModalSuppliersProps {
  supplierData: Supplier | null;
  fecharModal: () => void;
}

const ModalSuppliers: React.FC<ModalSuppliersProps> = ({
  supplierData,
  fecharModal,
}) => {
  const [supplier, setSupplier] = useState<Supplier>({
    id: supplierData?.id || undefined,
    name: '',
    description: '',
    phone: '',
    email: ''
  });

  useEffect(() => {
    if (supplierData) {
      setSupplier(supplierData);
    }
  }, [supplierData]);

  const handleSalvar = () => {
    if (supplier.id) {
      api
        .put(`/suppliers/${supplier.id}`, supplier)
        .then((response) => {
          console.log('Supplier Atualizado: ', response.data);
          fecharModal();
        })
        .catch((error) => {
          console.error('Erro ao atualizar supplier: ', error);
        });
    } else {
      api
        .post('/suppliers/', supplier)
        .then((response) => {
          console.log('Supplier criado: ', response.data);
          fecharModal();
        })
        .catch((error) => {
          console.error('Erro ao adicionar supplier: ', error);
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
                  value={supplier.name}
                  onChange={(e) =>
                    setSupplier({ ...supplier, name: e.target.value })
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
                  value={supplier.description}
                  onChange={(e) =>
                    setSupplier({
                      ...supplier,
                      description: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div className="field">
              <label className="label">Telefone</label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  placeholder="Telefone"
                  value={supplier.phone}
                  onChange={(e) =>
                    setSupplier({
                      ...supplier,
                      phone: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div className="field">
              <label className="label">E-mail</label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  placeholder="E-mail"
                  value={supplier.email}
                  onChange={(e) =>
                    setSupplier({
                      ...supplier,
                      email: e.target.value,
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

export default ModalSuppliers;
