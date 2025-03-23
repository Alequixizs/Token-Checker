# Discord Token Checker

Um verificador de tokens do Discord com interface em terminal, que verifica tokens e salva as informações em arquivos separados.

## Requisitos

- Node.js 20.11.1 ou superior
  - Download: [https://nodejs.org/](https://nodejs.org/)

## Instalação

1. Instale o Node.js
2. Abra o terminal na pasta do projeto
3. Execute o comando:
```bash
npm install
```

## Como Usar

1. Coloque os tokens no arquivo `tokens.txt` (um por linha)
2. Execute o programa:
```bash
node script.js
```
3. Use as setas ↑↓ para navegar e ENTER para selecionar uma opção

## Funcionalidades

- Verifica tokens do Discord
- Detecta contas com:
  - Nitro (Basic/Gaming)
  - Verificação de e-mail
  - Número de telefone vinculado
  - 2FA ativado

## Arquivos de Saída

Na pasta `output/`:
- `valid.txt` - Tokens válidos
- `invalid.txt` - Tokens inválidos
- `nitro.txt` - Contas com Nitro
- `verified.txt` - Contas verificadas
- `phones.txt` - Contas com telefone vinculado

## Formato do Relatório

O programa mostra em tempo real:
- Status (Válido/Inválido)
- Nome de usuário
- ID
- Status de verificação
- Tipo de Nitro
- E-mail
- Telefone