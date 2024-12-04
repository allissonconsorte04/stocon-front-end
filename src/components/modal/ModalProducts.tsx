import React, { useState, useEffect, useMemo } from "react";
import "./modalClientes.css";
import api from "../../services/api";
import { Product } from '../../pages/products/Products';
import { Category } from "../../pages/categories/Categories";
import { Supplier } from "../../pages/suppliers/Suppliers";
import { uploadImage } from "../../services/api-ocr";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

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
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadResponse, setUploadResponse] = useState<string>("");

  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const [productsData, setProductsData] = useState<Product[]>([]);  // Tipagem correta para o array

  const formatCurrency = (value: string): string => {
    const numericValue = Number(value.replace(/[^\d]/g, "")) / 100;
    return isNaN(numericValue)
      ? ""
      : numericValue.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        });
  };
  
  const parseCurrency = (formattedValue: string): number => {
    return Number(formattedValue.replace(/[^\d,-]/g, "").replace(",", "."));
  };



  const handlePriceChange = (field: 'price' | 'sale_price') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;

    // Remove caracteres não numéricos e vírgula
    const numericValue = rawValue.replace(/[^\d,]/g, "");

    // Se houver mais de 2 casas decimais, limita a 2 casas
    const formattedValue = numericValue.replace(
      /(\d)(?=(\d{3})+(?!\d))/g,
      "$1."
    ).replace(/,/g, "");

    // Converte o valor formatado para número
    const parsedValue = parseCurrency(formattedValue);

    // Atualiza o estado com o valor formatado
    setProduct((prevProduct) => ({
      ...prevProduct,
      [field]: parsedValue, // Atualiza o campo especificado (price ou sale_price)
    }));
  };

  const initialProductState: Product = useMemo(
    () => ({
      id: productData?.id || undefined,
      name: productData?.name || "",
      description: productData?.description || "",
      price: productData?.price || 0,
      quantity: productData?.quantity || 1,
      measurement: productData?.measurement || "UN",
      code: productData?.code || "",
      supplier_id: productData?.supplier_id || null,
      category_id: productData?.category_id || null,
      bar_code: productData?.bar_code || "",
      sale_price: productData?.sale_price || 0,
    }),
    [productData]
  );


  const [product, setProduct] = useState<Product>(initialProductState);

  useEffect(() => {
    if (!categories.length) {
      api.get("/categories").then((response) => setCategories(response.data));
    }
    if (!suppliers.length) {
      api.get("/suppliers").then((response) => setSuppliers(response.data));
    }
  }, []);

  useEffect(() => {
    setProduct(initialProductState);
  }, [initialProductState]);

  const validateForm = () => {
    if (product.bar_code = "") return "Digite o codigo de barras do produto.";
    if (!product.bar_code) return "Digite o codigo de barras do produto.";
    if (!product.name) return "Nome é obrigatório.";
    if (product.price <= 0) return "Valor do produto deve ser maior que zero.";
    if (product.quantity <= 0) return "Quantidade deve ser maior que zero.";
    if (!product.category_id) return "Selecione uma categoria.";
    if (!product.supplier_id) return "Selecione um fornecedor.";
    if (!product.sale_price) return "Valor de venda deve ser maior que zero.";
    return null;
  };

  const handleSaveAndUpdate = () => {
    const errorMessage = validateForm();
    if (errorMessage) {
      alert(errorMessage);
      return;
    }

    setIsSaving(true);

      // Função para converter valores com vírgula para número
      const convertToNumber = (value: string): number => {
        // Substitui a vírgula por ponto e converte para número

        return parseFloat(value.replace(",", "."))/100;
      };


      const productWithConvertedPrices = {
        ...product,
        price: convertToNumber(product.price.toString()), // Converte price
        sale_price: convertToNumber(product.sale_price.toString()), // Converte sale_price
      };

    // Salva o produto atual na API
    const request = product.id
      ? api.put(`/products/${product.id}`, productWithConvertedPrices)
      : api.post("/products/", productWithConvertedPrices);

    request
      .then((response) => {
        console.log("Produto salvo com sucesso:", response.data);

        // Depois de salvar, incrementa o índice para o próximo produto
        const nextIndex = currentProductIndex + 1;

        // Verifica se ainda existem mais produtos para carregar
        if (nextIndex < productsData.length) {
          setCurrentProductIndex(nextIndex); // Atualiza o índice do produto atual
          const nextProductData = productsData[nextIndex];
          // Carrega os dados do próximo produto

          setProduct((prevProduct) => ({
            ...prevProduct,  // Aqui você usa 'prevProduct' corretamente, que é o valor anterior
            name: nextProductData.name || prevProduct.name,
            code: nextProductData.code || prevProduct.code,
            description: nextProductData.description || prevProduct.description,
            price: nextProductData.price || prevProduct.price,  // Atualiza o preço com o valor convertido
            quantity: nextProductData.quantity || prevProduct.quantity,
            measurement: nextProductData.measurement || prevProduct.measurement,
            supplier_id: nextProductData.supplier_id || prevProduct.supplier_id,
            category_id: nextProductData.category_id || prevProduct.category_id,
            sale_price: nextProductData.sale_price || prevProduct.sale_price,
            bar_code: nextProductData.bar_code || prevProduct.bar_code,
          }));
        } else {
          fecharModal(); // Se não houver mais produtos, fecha a modal  
        }

      })
      .catch((error) => {
        alert("Ocorreu um erro ao salvar o produto. Tente novamente.");
        console.error("Erro ao salvar produto:", error);
      })
      .finally(() => {
        setIsSaving(false);
      });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUploadFile = async () => {
    if (selectedFile) {
      setLoading(true);
      try {
        let result;
        const fileType = selectedFile.type;

        if (fileType === "text/csv" || fileType === "text/xml") {
          result = await uploadImage(selectedFile);
        } else if (fileType.startsWith("image/")) {
          result = await uploadImage(selectedFile);
        } else {
          throw new Error("Tipo de arquivo não suportado.");
        }

        if (result) {
          setProductsData(result);  // Armazena os produtos no estado
          const productData = result[currentProductIndex];  // Usa o produto atual
          setProduct({
            ...product,
            name: productData.name || product.name,
            code: productData.code || product.code || productData.code,
            description: productData.description || product.description,
            price: productData.unit_price || product.price,
            quantity: productData.quantity || product.quantity,
            measurement: productData.measurement || product.measurement,
            sale_price: productData.sale_price || product.sale_price,
            bar_code: productData.bar_code || product.bar_code
          });
        }

        setUploadResponse(result);
        console.log("Upload bem-sucedido:", result);

      } catch (error) {
        console.error("Erro no upload do arquivo:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (

    <div className="modal is-active">


      <div className="modal-background" onClick={fecharModal}></div>

      <div className="modal-card">

        <header className="modal-card-head">
          <div className="product-counter">
            {productsData.length > 0 && (
              <span className="font-bold">
                {`Produto ${currentProductIndex + 1} de ${productsData.length}`}
              </span>
            )}
          </div>
          <Button
            className="delete"
            aria-label="close"
            onClick={fecharModal}
          ></Button>

        </header>
        <section className="modal-card-body">
          {loading && (
            <div className="loading-overlay">
              <div className="loading-message">Carregando o seu arquivo...</div>
            </div>
          )
          }

          <div>
            <div className="box-btns-prd">
              <Input
                type="file"
                accept=".csv, .xml, image/*"
                onChange={handleFileChange}
              />
              <Button className="ml-2 bg-blue-600 text-white hover:border-black" onClick={handleUploadFile} disabled={loading}>
                {loading ? "Carregando..." : "Upload Arquivo"}
              </Button>

            </div>

            <div className="field mt-3">
              <label className="label">Código de barras</label>
              <div className="control">
                <Input
                  className="input"
                  type="text"
                  placeholder="Codigo de barras"
                  value={product.bar_code}
                  onChange={(e) =>
                    setProduct({ ...product, bar_code: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="field">
              <label className="label">Nome</label>
              <div className="control">
                <Input
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
                <Input
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
              <label className="label">Valor do produto</label>
              <div className="control">
                <Input
                  className="input"
                  type="text"
                  placeholder="Valor do produto"
                  value={formatCurrency(product.price.toString())} // Exibe o valor formatado
                  onChange={handlePriceChange('price')} // Chama a função com 'price' como parâmetro
                />
              </div>
            </div>

            <div className="field">
              <label className="label">Valor de venda</label>
              <div className="control">
                <Input
                  className="input"
                  type="text"
                  placeholder="Valor de venda"
                  value={formatCurrency(product.sale_price.toString())} // Exibe o valor formatado
                  onChange={handlePriceChange('sale_price')} // Chama a função com 'sale_price' como parâmetro
                />
              </div>
            </div>


            <div className="field">
              <label className="label">Quantidade</label>
              <div className="control">
                <Input
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
              <label className="label">Unidade de medida</label>
              <div className="control">
                <Input
                  className="input"
                  type="string"
                  placeholder="Unidade de medida"
                  value={product.measurement}
                  onChange={(e) =>
                    setProduct({
                      ...product,
                      measurement: e.target.value,
                    })
                  }
                />
              </div>
            </div>


            <div className="field">
              <label className="label">Código</label>
              <div className="control">
                <Input
                  required
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
                    required
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
          <button className="button-salvar px-4 bg-blue-500 text-white mr-2 h-full rounded-lg" onClick={handleSaveAndUpdate} disabled={isSaving}>
            {isSaving ? "Salvando..." : "Salvar"}
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
