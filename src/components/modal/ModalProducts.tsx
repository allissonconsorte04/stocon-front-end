import React, { useState, useEffect, useMemo } from "react";
import "./modalClientes.css";
import api from "../../services/api";
import { Product } from '../../pages/products/Products';
import { Category } from "../../pages/categories/Categories";
import { Supplier } from "../../pages/suppliers/Suppliers";
import { uploadImage } from "../../services/api-ocr";

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
 


  const initialProductState: Product = useMemo(
    () => ({
      id: productData?.id || undefined,
      productName: productData?.productName || "",
      description: productData?.description || "",
      unit_price: productData?.unit_price || 0,
      quantity: productData?.quantity || 1,
      measurement: productData?.measurement || "UN",
      code: productData?.code || "",
      supplier_id: productData?.supplier_id || null,
      category_id: productData?.category_id || null,
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
    if (!product.productName) return "Nome é obrigatório.";
    if (product.unit_price <= 0) return "Preço deve ser maior que zero.";
    if (product.quantity <= 0) return "Quantidade deve ser maior que zero.";
    if (!product.category_id) return "Selecione uma categoria.";
    if (!product.supplier_id) return "Selecione um fornecedor.";
    return null;
  };

  const handleSaveAndUpdate = () => {
    const errorMessage = validateForm();
    if (errorMessage) {
      alert(errorMessage);
      return;
    }

    setIsSaving(true);

    // Salva o produto atual na API
    const request = product.id
      ? api.put(`/products/${product.id}`, product)
      : api.post("/products/", product);

    request
      .then((response) => {
        console.log("Produto salvo com sucesso:", response.data);

        // Depois de salvar, incrementa o índice para o próximo produto
        const nextIndex = currentProductIndex + 1;

        // Verifica se ainda existem mais produtos para carregar
        if (nextIndex < productsData.length) {
          setCurrentProductIndex(nextIndex); // Atualiza o índice do produto atual
          const nextProductData = productsData[nextIndex];  // Carrega os dados do próximo produto

          setProduct({
            ...product,
            productName: nextProductData.productName || product.productName,  // Acessando 'name' e outras propriedades corretamente
            code: nextProductData.code || product.code,
            description: nextProductData.description || product.description,
            unit_price: nextProductData.unit_price || product.unit_price,
            quantity: nextProductData.quantity || product.quantity,
          });
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
          console.log("Processamento de CSV ou XML ainda não implementado.");
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
            productName: productData.productName || product.productName,
            code: productData.barCode || product.code || productData.code,
            description: productData.measurement || product.description,
            unit_price: productData.unit_price || product.unit_price || productData.total_price,
            quantity: productData.quaquantity || product.quantity,
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
          <button
            className="delete"
            aria-label="close"
            onClick={fecharModal}
          ></button>
        </header>
        <section className="modal-card-body">
          <div>
            <div className="box-btns-prd">
              <input
                type="file"
                accept=".csv, .xml, image/*"
                onChange={handleFileChange}
              />
              <button onClick={handleUploadFile} disabled={loading}>
                {loading ? "Carregando..." : "Upload Arquivo"}
              </button>

            </div>

            <div className="field">
              <label className="label">Nome</label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  placeholder="Nome"
                  value={product.productName}
                  onChange={(e) =>
                    setProduct({ ...product, productName: e.target.value })
                  }
                />
              </div>
            </div>
            {/* Restante dos campos... */}
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
                  value={product.unit_price}
                  onChange={(e) =>
                    setProduct({
                      ...product,
                      unit_price: Number(e.target.value),
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
          <button onClick={handleSaveAndUpdate} disabled={isSaving}>
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
