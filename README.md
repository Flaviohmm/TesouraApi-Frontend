# Tesoura

Interface web para gestão de salões de beleza. O projeto consome a API Tesoura para autenticação, cadastro de salões, agenda, clientes e catálogo de serviços.

## Tecnologias

- React + TypeScript
- Vite
- Tailwind CSS
- Lucide React

## Pré-requisitos

- Node.js 20 ou superior
- API do backend Tesoura em execução (por padrão, em `http://localhost:8080`)

## Como executar

```bash
npm install
npm run dev
```

O frontend estará disponível em `http://localhost:5173`. Durante o desenvolvimento, as chamadas iniciadas por `/api` são encaminhadas para o backend em `http://localhost:8080`.

Para criar uma versão de produção:

```bash
npm run build
npm run preview
```

## Configuração da API

Por padrão, a aplicação usa a mesma origem do frontend e depende do proxy de desenvolvimento do Vite. Para apontar para outra API, crie um arquivo `.env` na raiz:

```env
VITE_API_URL=https://sua-api.exemplo.com
```

## Fluxos disponíveis

### Cadastro do salão

A página de login contém o acesso **Crie seu salão**. O formulário envia uma requisição para `POST /api/auth/register` com:

- nome do salão;
- slug/endereço público do salão;
- nome do proprietário;
- e-mail;
- telefone opcional;
- senha e confirmação de senha.

O slug é sugerido a partir do nome do salão e pode ser editado. Após um cadastro bem-sucedido, a API devolve o token de acesso e o usuário entra automaticamente na aplicação.

### Login

O login usa `POST /api/auth/login`. O token retornado é armazenado no navegador e enviado como `Authorization: Bearer <token>` nas chamadas autenticadas.

### Gestão

Após autenticação, a interface apresenta as áreas de visão geral, agenda, clientes e serviços. Os dados são consumidos pelos endpoints protegidos da API Tesoura.

## Scripts

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Inicia o ambiente de desenvolvimento. |
| `npm run build` | Verifica os tipos e gera a build de produção. |
| `npm run preview` | Serve localmente a build gerada. |
| `npm run lint` | Executa o lint do projeto. |
