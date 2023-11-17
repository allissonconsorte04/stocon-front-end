import React, { useState, useEffect } from 'react';
import './cardproduto.css';
import api from '../../services/api';

interface Product {
  id: number;
  nome: string;
  preco: string;
}

const CardProduto = () => {
  const [produtos, setProdutos] = useState([]);

  useEffect(() => {
    api
      .get('/produtos')
      .then((response) => {
        setProdutos(response.data);
      })
      .catch((error) => {
        console.error('Erro ao obter produtos:', error);
      });
  }, []);

  return (
    <div className="card-container">
      {produtos.map((produto: Product) => (
        <div className="card-content" key={produto.id}>
          <div className="product-content">
            <h2>{produto.nome}</h2>
            <p>Preço: R$ {produto.preco}</p>
          </div>
          <button className="btn-add">+</button>
        </div>
      ))}
    </div>
  );
};

export default CardProduto;
