# Teste Técnico — Estágio Frontend

Bem-vindo(a)! Este teste avalia como você lê um layout de referência,
integra uma API real e organiza componentes React com TypeScript.

## O que já está pronto

O projeto é um starter Vite + React 19 + TypeScript + Tailwind CSS,
com [lucide-react](https://lucide.dev/) para ícones. Já vêm prontos:

- Tela de login (`LoginGate`) — apenas pede um nome, sem autenticação real.
- Layout do app: `Sidebar` (menu lateral) e `TopBar` (cabeçalho com o usuário logado).
- Um formulário de busca por CNPJ, com input e botão, na tela principal.

Tudo isso está em [src/App.tsx](src/App.tsx).

## O que você precisa fazer

Dentro de `src/App.tsx`, no lugar do comentário:

```tsx
{/* TODO candidato: renderizar aqui o resultado, reproduzindo o layout do print */}
```

implemente a consulta de empresa por CNPJ, consumindo a
[BrasilAPI](https://brasilapi.com.br/docs#tag/CNPJ) (pública, gratuita,
sem necessidade de chave/token):

```
GET https://brasilapi.com.br/api/cnpj/v1/{cnpj}
```

O resultado esperado, reproduzindo o layout abaixo, é:

![Gabarito da consulta de CNPJ](public/gabarito-cnpj.png)

CNPJ usado no print acima (para você testar): `33.000.167/0001-01`.

### Requisitos funcionais

- **Máscara/formatação** do CNPJ enquanto o usuário digita (`00.000.000/0000-00`).
- **Validação**: se o CNPJ não tiver 14 dígitos, exibir uma mensagem de erro
  sem chamar a API.
- **Estado de carregamento** no botão "Buscar" enquanto a requisição está em andamento.
- **Estado de erro**: se a API retornar erro (CNPJ inválido, inexistente,
  fora do ar), exibir uma mensagem amigável.
- **Card de resultado** com, no mínimo:
  - Razão social, nome fantasia e situação cadastral (com destaque visual
    para ativa/inativa);
  - CNPJ, data de abertura, porte, natureza jurídica, capital social e
    atividade principal;
  - Endereço completo, telefone e e-mail;
  - Quadro societário (nome e qualificação de cada sócio).

### O que avaliamos

- Fidelidade ao layout de referência (não precisa ser pixel-perfect, mas
  a estrutura, hierarquia e uso de cores/ícones devem ser equivalentes).
- Organização do código: componentes pequenos e coesos, tipagem correta
  em TypeScript (evite `any`).
- Tratamento de estados (ocioso, carregando, erro, sucesso) e de casos de
  borda (CNPJ inválido, sem nome fantasia, sem e-mail, etc.).
- Uso correto de React (estado, formulários controlados, eventos).
- Organização dos commits no Git (histórico legível, mensagens claras).

Não é necessário:

- Autenticação real, backend próprio ou persistência de dados.
- Testes automatizados (é um diferencial, mas não obrigatório).
- Responsividade completa para mobile (o foco é desktop).

## Como rodar o projeto

```bash
npm install
npm run dev
```

Abra o endereço exibido no terminal (geralmente `http://localhost:5173`),
digite qualquer nome na tela de login e você chegará na tela de busca.

Outros comandos úteis:

```bash
npm run lint     # roda o Oxlint
npm run build    # type-check (tsc) + build de produção
```

## Como entregar

1. Crie um repositório (pode ser um fork/cópia deste) e faça commits
   normalmente conforme for implementando.
2. Ao concluir, envie o link do repositório (ou um `.zip`, se preferir)
   para quem te passou este teste.
3. Fique à vontade para descrever no próprio README, ou em uma mensagem
   junto da entrega, decisões que você tomou e o que faria diferente
   com mais tempo.

Qualquer dúvida sobre o enunciado, pergunte antes de começar — faz parte
do processo. Boa sorte!
