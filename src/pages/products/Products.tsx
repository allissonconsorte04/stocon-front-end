import { useEffect, useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

import './products.css';
import api from '../../services/api';
import { Supplier } from '../suppliers/Suppliers';
import { Category } from '../categories/Categories';
import ModalProducts from '../../components/modal/ModalProducts';

import Loading from '../../components/loading/Loading';

import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { jsPDF } from 'jspdf';


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
  bar_code: string;
  supplier?: Supplier;
  category?: Category;
  sale_price: number;
}

const newProduct = {
  bar_code: '',
  name: '',
  description: '',
  price: 0,
  quantity: 1,
  measurement: 'UN',
  code: '',
  sale_price: 0,
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
  }

  // Função para gerar o PDF
  const generatePDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('Relatório de Produtos', 20, 20);
    let yPosition = 30; // Definindo a posição inicial para o texto
    const maxY = 270; // Máxima posição Y na página

    products.forEach((product) => {
      // Verifica se há espaço suficiente para o próximo bloco de informações
      if (yPosition + 60 > maxY) {
        doc.addPage(); // Se não houver, adiciona uma nova página
        yPosition = 20; // Reinicia a posição Y para a nova página
      }

      // Adiciona as informações do produto
      doc.setFontSize(12);
      doc.text(`ID: ${product.id}`, 20, yPosition);
      yPosition += 10;

      doc.text(`Nome: ${product.name}`, 20, yPosition);
      yPosition += 10;

      doc.text(`Descrição: ${product.description}`, 20, yPosition);
      yPosition += 10;

      doc.text(`Preço: ${product.price}`, 20, yPosition);
      yPosition += 10;

      doc.text(`Quantidade: ${product.quantity}`, 20, yPosition);
      yPosition += 10;

      doc.text(`Unidade: ${product.measurement}`, 20, yPosition);
      yPosition += 10;

      doc.text(`Código: ${product.code}`, 20, yPosition);
      yPosition += 10;

      doc.text(`Categoria: ${product.category?.name || 'N/A'}`, 20, yPosition);
      yPosition += 10;

      doc.text(`Fornecedor: ${product.supplier?.name || 'N/A'}`, 20, yPosition);
      yPosition += 10;

      doc.text(`Preço de Venda: ${product.sale_price}`, 20, yPosition);
      yPosition += 15; // Adiciona mais espaçamento entre os produtos
    });

    // Salvar o PDF
    doc.save('relatorio_produtos.pdf');
  };

  return (
    <div className="products-container">
    {loading ? (
      <Loading />
    ) : (
      <>
        <div className="add-product-container mb-4">
          <Button className="hover:bg-blue-600 rounded-xl" onClick={() => handleEditarProduct(newProduct)}>
            Adicionar Produto +
          </Button>
          <Button className="hover:bg-green-600 rounded-xl ml-2" onClick={generatePDF}>
              Gerar Relatório PDF
            </Button>
        </div>

        <Table >
          <TableHeader >
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Código</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead>Preço de Venda</TableHead>
              <TableHead>Quantidade</TableHead>
              <TableHead>Unidade</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Fornecedor</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.id}</TableCell>
                <TableCell>{product.bar_code}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.description}</TableCell>
                <TableCell>R$ {product.price*100}</TableCell>
                <TableCell>R$ {product.sale_price}</TableCell>
                <TableCell>{product.quantity}</TableCell>
                <TableCell>{product.measurement}</TableCell>
                <TableCell>{product.category?.name || 'N/A'}</TableCell>
                <TableCell>{product.supplier?.name || 'N/A'}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEditarProduct(product)}>
                      <FontAwesomeIcon icon={faEdit} />
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleRemoveProduct(product)}>
                      <FontAwesomeIcon icon={faTrashAlt} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

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
