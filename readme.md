# Scaffold API

Uma API scaffold com verificações de **Health Check**. Esta aplicação inclui documentação via **Swagger**, e foi desenvolvida com foco em boas práticas e cobertura completa de testes.

## 📋 Funcionalidades

- **Health Check**: Verificação do status da aplicação.
- **Swagger Integration**: Documentação interativa para facilitar testes e integração.
- **Token Authentication**: Proteção de endpoints sensíveis com Bearer Token.

---

## 🚀 Tecnologias Utilizadas

- **Node.js**
- **Express**
- **Knex.js** (ORM para gerenciar o banco de dados)
- **TypeScript**
- **Swagger UI** (Documentação)
- **Jest** (Testes Unitários)

---

## 🛠️ Configuração e Instalação

### Pré-requisitos

- [Node.js](https://nodejs.org/) (versão LTS recomendada)
- [Docker](https://www.docker.com/)
- Gerenciador de Pacotes: `npm` ou `yarn`

### Passo a passo

1. **Clone o Repositório**

2. **Instale as Dependências**

   ```bash
   npm install
   # ou
   yarn install
   ```

3. **Configure as Variáveis de Ambiente**

   Crie um arquivo `.env` copiando os valores do arquivo `.env.example`, definindo somente seu usuário e senha do banco de dados e, se necessário, a porta de desenvolvimento.
4. **Inicie o Servidor**

   ```bash
   npm start
   # ou
   yarn start
   ```

   O servidor estará disponível em [http://localhost:3001](http://localhost:3001).

---

## 📖 Documentação

A documentação da API pode ser acessada em [http://localhost:3001/api-docs](http://localhost:3001/api-docs).

---

## 🧪 Testes

Execute os testes unitários com cobertura completa:

```bash
npm test -- ---coverage
# ou
yarn test -- ---coverage
```

---

## 📂 Estrutura do Projeto

```
src/
├── application/
│   ├── services/
├── domain/
│   ├── dtos/
│   ├── entities/
│   ├── repositories/
│   └── validation/
├── infrastructure/
│   ├── adapters/
│   ├── data/
│   ├── DependencyInjector.ts
├── presentation/
│   ├── controllers/
│   ├── routes/
├── shared/
│   ├── exceptions/
│   └── logging/
├── tests/
└── swagger.json
```

---

## ⚙️ Desenvolvimento

- **Start do Servidor em Ambiente de Desenvolvimento e debug:**

  ```bash
  npm run dev
  ```

- **Suba o Ambiente com Docker Compose:**

Basta executar o comando abaixo. Isso irá construir a imagem da API e iniciar o projeto na porta 3001.
   ```bash
   docker-compose up --build
   ```