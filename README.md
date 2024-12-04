# Projeto de Gerenciamento de Estoque  

Este é o projeto desenvolvido para o Trabalho de Conclusão de Curso (TCC) no curso de Engenharia de Software. O objetivo do sistema é gerenciar estoques com funcionalidades de leitura de imagens e cadastramento automático de produtos. A aplicação utiliza React, Tailwind CSS, e outras bibliotecas para fornecer uma interface moderna e eficiente.  

## Índice  
- [Sobre o Projeto](#sobre-o-projeto)  
- [Funcionalidades](#funcionalidades)  
- [Tecnologias Utilizadas](#tecnologias-utilizadas)  
- [Pré-requisitos](#pré-requisitos)  
- [Instalação](#instalação)  
- [Execução](#execução)  
- [Estrutura do Projeto](#estrutura-do-projeto)  

## Sobre o Projeto  
Este sistema foi projetado para otimizar o gerenciamento de estoques, permitindo o cadastramento automático de produtos a partir de imagens capturadas. Ele é ideal para restaurantes, mercados ou outros estabelecimentos que precisam de uma gestão eficiente e prática dos itens em estoque.  

## Funcionalidades  
- Cadastro de produtos a partir de leitura de imagens (OCR integrado).  
- Atualização automática de informações de estoque.  
- Interface de usuário responsiva, desenvolvida com Tailwind CSS.  
- Integração com APIs para gerenciamento de dados.  

## Tecnologias Utilizadas  
- **Frontend:** React, TypeScript  
- **Estilização:** Tailwind CSS, Bulma  
- **Gerenciamento de rotas:** React Router  
- **HTTP Requests:** Axios  
- **Build Tool:** Vite  
- **Bibliotecas de ícones:** FontAwesome, Material Design Icons  

## Pré-requisitos  
Certifique-se de que você tenha os seguintes softwares instalados no seu ambiente:  
- [Node.js](https://nodejs.org) (versão 16 ou superior)  
- [Git](https://git-scm.com/)  
- Um editor de código, como [VSCode](https://code.visualstudio.com/)  

## Instalação  
Clone o repositório do projeto:  

```bash  
git clone https://github.com/seu-usuario/nome-do-repositorio.git  
cd nome-do-repositorio
```
Instale as dependências:
```bash  
npm install  
```
## Execução
Inicie o servidor de desenvolvimento:
```bash  
npm run dev   
```
Acesse a aplicação no navegador:
```bash  
http://localhost:5173 
```
Para criar a versão de produção:
```bash  
npm run build  
```

## Estrutura do Projeto
Abaixo está uma visão geral da estrutura de diretórios do projeto:
```bash  
├── src/  
│   ├── components/    # Componentes reutilizáveis  
│   ├── pages/         # Páginas principais da aplicação  
│   ├── services/      # Serviços para chamadas de API  
│   ├── styles/        # Arquivos de estilo  
│   ├── App.tsx        # Componente raiz  
│   └── main.tsx       # Arquivo de entrada  
├── public/            # Arquivos estáticos  
├── package.json       # Gerenciamento de dependências  
├── tailwind.config.js # Configuração do Tailwind CSS  
├── vite.config.ts     # Configuração do Vite  
└── README.md          # Documentação do projeto
```
