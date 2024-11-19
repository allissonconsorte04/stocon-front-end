import { useEffect, useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

import './products.css';
import api from '../../services/api';
import { Supplier } from '../suppliers/Suppliers';
import { Category } from '../categories/Categories';
import ModalProducts from '../../components/modal/ModalProducts';

import Loading from '../../components/loading/Loading';

export interface Product {
  id?: number;
  name: string;
  description: string;
  price: string;
  quantity: number;
  category_id?: number | null;
  measurement: string;
  supplier_id?: number | null;
  code: string;
  supplier?: Supplier;
  category?: Category;
}

const newProduct = {
  name: '',
  description: '',
  price: "0",
  quantity: 1,
  measurement: 'UN',
  code: ''
};

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [productParaEditar, setProductParaEditar] = useState<Product | null>(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getAllProducts();
  }, []);

  const getAllProducts = () => {
    setLoading(true); // Ativa o loading enquanto busca os produtos
    api
      .get('/products')
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error('Erro ao obter produtos:', error);
      })
      .finally(() => {
        setLoading(false); // Finaliza o loading quando os dados forem obtidos
      });
  };

  const handleEditarProduct = (product: Product) => {
    setProductParaEditar(product);
    setModalVisible(true);
  };

  const handleRemoveProduct = (product: Product) => {
    const confirmDelete = window.confirm(`Tem certeza que deseja excluir o produto "${product.name}"?`);
  
    if (confirmDelete) {
      api
        .delete(`/products/${product.id}`)
        .then((response) => {
          console.log("Produto deletado: ", response.data);
          fecharModal();
        })
        .catch((error) => {
          console.error("Erro ao deletar produto: ", error);
        });
    }
  };
  const fecharModal = () => {
    setModalVisible(false);
    setProductParaEditar(null);
    getAllProducts();
  };


  return (
    <div className="products-container">
      {loading ? (
        <Loading /> // Exibe o componente de loading enquanto o estado "loading" for true
      ) : (
        <>
          <div className="add-product-container">
            <button
              className="btn btn-add-product"
              onClick={() => handleEditarProduct(newProduct)}
            >
              Adicionar Produto +
            </button>
            

          </div>

          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Descrição</th>
                <th>Preço</th>
                <th>Quantidade</th>
                <th>Unidade</th>
                <th>Código</th>
                <th>Categoria</th>
                <th>Fornecedor</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="id-columns">{product.id}</td>
                  <td>{product.name}</td>
                  <td>{product.description}</td>
                  <td>{product.price}</td>
                  <td>{product.quantity}</td>
                  <td>{product.measurement}</td>
                  <td>{product.code}</td>
                  <td>{product.category?.name}</td>
                  <td>{product.supplier?.name}</td>
                  <td>
                    <button onClick={() => handleEditarProduct(product)}>
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button onClick={() => handleRemoveProduct(product)}>
                      <FontAwesomeIcon icon={faTrashAlt} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {isModalVisible && (
            <ModalProducts
              productData={productParaEditar}
              fecharModal={fecharModal}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Products;
