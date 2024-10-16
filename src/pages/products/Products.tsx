import { useEffect, useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

import './products.css'; // Certifique-se de ter o arquivo de estilo adequado
import api from '../../services/api';
import { Supplier } from '../suppliers/Suppliers';
import { Category } from '../categories/Categories';
import ModalProducts from '../../components/modal/ModalProducts';
import { uploadImage } from '../../services/api-ocr';

export interface Product {
  id?: number;
  name: string;
  description: string;
  price: number;
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
  price: 0,
  quantity: 1,
  measurement: 'UN',
  code: ''
};

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [productParaEditar, setProductParaEditar] = useState<Product | null>(
    null
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null); // Estado para o arquivo
  const [uploadResponse, setUploadResponse] = useState<string>(''); // Estado para a resposta do upload

  useEffect(() => {
    getAllProducts();
  }, []);

  const getAllProducts = () => {
    api
      .get('/products')
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error('Erro ao obter produtos:', error);
      });
  };

  const handleEditarProduct = (product: Product) => {
    setProductParaEditar(product);
    setModalVisible(true);
  };

  const handleRemoveProduct = (product: Product) => {
    api
      .delete(`/products/${product.id}`)
      .then((response) => {
        console.log('Produto deletado: ', response.data);
        fecharModal();
      })
      .catch((error) => {
        console.error('Erro ao deletar produto: ', error);
      });
  };

  const fecharModal = () => {
    setModalVisible(false);
    setProductParaEditar(null);
    getAllProducts();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUploadFile = async () => {
    if (selectedFile) {
      try {
        const result = await uploadImage(selectedFile);
        setUploadResponse(result); // Exibe a resposta do backend
        console.log('Upload bem-sucedido:', result);
      } catch (error) {
        console.error('Erro no upload do arquivo:', error);
      }
    }
  };

  return (
    <div className="products-container">
      <div className="add-product-container">
        <button
          className="btn btn-add-product"
          onClick={() => handleEditarProduct(newProduct)}
        >
          Adicionar Produto +
        </button>
        <div>
          <input type="file" onChange={handleFileChange} />
          <button onClick={handleUploadFile}>Upload Arquivo</button>
          {uploadResponse && <div>Resposta do servidor: {uploadResponse}</div>}
        </div>
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
    </div>
  );
};

export default Products;
