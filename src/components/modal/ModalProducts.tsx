import React, { useState, useEffect } from "react";
import "./modalClientes.css";
import api from "../../services/api";
import { Product } from "../../pages/products/Products";
import { Category } from "../../pages/categories/Categories";
import { Supplier } from "../../pages/suppliers/Suppliers";

interface ModalProductsProps {
  productData: Product | null;
  fecharModal: () => void;
}

const ModalProducts: React.FC<ModalProductsProps> = ({
  productData,
  fecharModal,
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [product, setProduct] = useState<Product>({
    id: productData?.id || undefined,
    name: "",
    description: "",
    price: 0,
    quantity: 1,
    measurement: "UN",
    code: "",
    supplier_id: null,
    category_id: null
  });

  useEffect(() => {
    api.get("/categories").then((response) => {
      setCategories(response.data);
    });

    api.get("/suppliers").then((response) => {
      setSuppliers(response.data);
    });

    if (productData) {
      setProduct(productData);
    }
  }, [productData]);

  const handleSalvar = () => {
    console.log('Estado do produto antes da requisição:', product);
    if (product.id) {
      api
        .put(`/products/${product.id}`, product)
        .then((response) => {
          console.log("Product Atualizado: ", response.data);
          fecharModal();
        })
        .catch((error) => {
          console.error("Erro ao atualizar product: ", error);
        });
    } else {
      api
        .post("/products/", product)
        .then((response) => {
          console.log("Product criado: ", response.data);
          fecharModal();
        })
        .catch((error) => {
          console.error("Erro ao adicionar product: ", error);
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
                  value={product.name}
                  onChange={(e) =>
                    setProduct({ ...product, name: e.target.value })
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
                  value={product.description}
                  onChange={(e) =>
                    setProduct({
                      ...product,
                      description: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div className="field">
              <label className="label">Preço</label>
              <div className="control">
                <input
                  className="input"
                  type="number"
                  placeholder="Preço"
                  value={product.price}
                  onChange={(e) =>
                    setProduct({
                      ...product,
                      price: parseFloat(e.target.value),
                    })
                  }
                />
              </div>
            </div>
            <div className="field">
              <label className="label">Quantidade</label>
              <div className="control">
                <input
                  className="input"
                  type="number"
                  placeholder="Quantidade"
                  value={product.quantity}
                  onChange={(e) =>
                    setProduct({
                      ...product,
                      quantity: Number(e.target.value),
                    })
                  }
                />
              </div>
            </div>
            <div className="field">
              <label className="label">Código</label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  placeholder="Código"
                  value={product.code}
                  onChange={(e) =>
                    setProduct({
                      ...product,
                      code: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div className="field">
              <label className="label">Categoria</label>
              <div className="control">
                <div className="select">
                  <select
                    value={product.category_id || ''}
                    onChange={(e) =>
                      setProduct({
                        ...product,
                        category_id: Number(e.target.value),
                      })
                    }
                  >
                    <option value="" disabled>
                      Selecione uma categoria
                    </option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="field">
              <label className="label">Fornecedor</label>
              <div className="control">
                <div className="select">
                  <select
                    value={product.supplier_id || ''}
                    onChange={(e) =>
                      setProduct({
                        ...product,
                        supplier_id: Number(e.target.value),
                      })
                    }
                  >
                    <option value="" disabled>
                      Selecione um fornecedor
                    </option>
                    {suppliers.map((supplier) => (
                      <option key={supplier.id} value={supplier.id}>
                        {supplier.name}
                      </option>
                    ))}
                  </select>
                </div>
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

export default ModalProducts;
