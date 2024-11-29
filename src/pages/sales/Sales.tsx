"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Importando os componentes corretos do Shadcn
import { useToast } from "@/hooks/use-toast"; // Supondo que você tenha um componente Toast para mostrar mensagens
import api from "@/services/api"; // Para a requisição API
import { SaleSuccessModal } from "@/components/SaleSuccessModal/SaleSuccessModal";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export function SalesPage() {
    const [products, setProducts] = useState<any[]>([]); // Lista de produtos
    const [selectedProduct, setSelectedProduct] = useState<string | undefined>(undefined);
    const [quantity, setQuantity] = useState<number>(1);
    const [userId, setUserId] = useState<number>(1); // Id do usuário, pode ser obtido de contexto ou sessão
    const [saleItems, setSaleItems] = useState<any[]>([]); // Itens da venda
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [saleId, setSaleId] = useState<number | null>(null); // Para armazenar o ID da venda
    const [isModalOpen, setIsModalOpen] = useState(false); // Controle do modal
    const [searchQuery, setSearchQuery] = useState('');
    const [openModalError, setOpenModalError] = useState(false); // Controle do modal


    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );


    const { toast } = useToast();

    // Carregar produtos ao montar o componente
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await api.get("/products");
                setProducts(response.data);
            } catch (error) {
                console.error("Erro ao carregar produtos:", error);
            }
        };

        fetchProducts();
    }, []);

    // Função para adicionar itens à venda
    const handleAddItem = () => {
        if (selectedProduct && quantity > 0) {
            const productId = Number(selectedProduct); // Converte para número
            const product = products.find((prod) => prod.id === productId);
    
            if (product) {
                if (quantity > product.quantity) {
                    setOpenModalError(true);
                    setError(` ${product.quantity}`);
                } else {
                    // Adiciona o item à venda
                    setSaleItems([
                        ...saleItems,
                        { product_id: product.id, quantity },
                    ]);
                    setError(null); // Limpa o erro, se houver
                }
            } else {
                console.log("Produto não encontrado.");
            }
        }
    };

    // Função para remover item da venda
    const handleRemoveItem = (index: number) => {
        setSaleItems(saleItems.filter((_, i) => i !== index));
    };

    const fecharModal = () => {
        setOpenModalError(false);
        setError(null); // Limpa o erro
    };

    // Função para enviar a venda
    const handleSubmitSale = async () => {
        setLoading(true);
        setError(null);

        const saleData = {
            sale: {
                user_id: userId,
            },
            sale_items: saleItems,
        };

        console.log(saleData)

        try {
            const saleData = {
                sale: {
                    user_id: 1, // Substitua conforme necessário
                },
                sale_items: saleItems,
            };

            const response = await api.post("/sales", saleData);

            // Obtenha o ID da venda
            const { id } = response.data;

            // Salve o ID da venda e abra o modal
            setSaleId(id);
            setIsModalOpen(true); // Abre o modal
            setSaleItems([]); // Limpar itens da venda
        } catch (error) {
            console.error("Erro ao realizar a venda", error);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Tela de Vendas</h1>

            {/* Formulário de Vendas */}
            <div className="mb-4 ">
                <div className="mb-2">
                    <Label htmlFor="product">Produto</Label>
                    <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                        <SelectTrigger className="hover:bg-gray-50">
                            <SelectValue placeholder="Selecione um produto" />
                        </SelectTrigger>
                        <SelectContent>
                            <input
                                type="text"
                                placeholder="Pesquisar produto..."
                                value={searchQuery} // Atualiza o valor diretamente
                                onChange={(e) => setSearchQuery(e.target.value)} // Atualiza a pesquisa
                                className="p-2 w-full border rounded-md mb-2"
                            />
                            {filteredProducts.length > 0 ? (
                                filteredProducts.map((product) => (
                                    <SelectItem key={product.id} value={String(product.id)}>
                                        {product.name} - R$ {product.price}
                                    </SelectItem>
                                ))
                            ) : (
                                <SelectItem value=" " disabled>Sem produtos encontrados</SelectItem>
                            )}
                        </SelectContent>
                    </Select>
                </div>

                <div className="mb-2">
                    <Label htmlFor="quantity">Quantidade</Label>
                    <Input
                        id="quantity"
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                    />
                </div>

                <Button onClick={handleAddItem}>Adicionar Item</Button>
            </div>

            {/* Lista de Itens da Venda */}
            <div className="mb-4">
                <h2 className="text-lg font-semibold">Itens da Venda</h2>
                <ul>
                    {saleItems.map((item, index) => (
                        <li key={index} className="flex justify-between">
                            <span>{products.find((p) => p.id === item.product_id)?.name}</span>
                            <span>Quantidade: {item.quantity}</span>
                            <Button variant="outline" onClick={() => handleRemoveItem(index)}>
                                Remover
                            </Button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Exibir Erro se houver */}
            {error && <p className="text-red-500">{error}</p>}

            {/* Botão para Enviar a Venda */}
            <Button
                onClick={handleSubmitSale}
                disabled={loading || saleItems.length === 0}
            >
                {loading ? "Enviando..." : "Finalizar Venda"}
            </Button>

            {/* Modal que exibe o sucesso da venda */}
            {saleId && (
                <SaleSuccessModal saleId={saleId} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            )}

<Dialog open={openModalError}>
    <DialogTrigger />
    <DialogContent>
        <DialogHeader>
            <DialogTitle>Erro ao adicionar item</DialogTitle>
        </DialogHeader>
        <DialogDescription>
            Não há estoque suficiente para este produto. <br />
            Quantidade disponível: <strong>{error}</strong>
        </DialogDescription>
        <DialogFooter>
            <Button onClick={fecharModal}>Fechar</Button>
        </DialogFooter>
    </DialogContent>
</Dialog>

        </div>
    );
}
