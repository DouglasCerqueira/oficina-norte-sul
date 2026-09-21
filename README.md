# Oficina Norte Sul — Cadastro de Colaboradores

Sistema de demonstração para cadastro e gestão de colaboradores de uma empresa
fictícia (Oficina Norte Sul). Feito como exercício de portfólio, focado em CRUD,
filtro, controle de permissão e organização de código — não é um produto em
produção.

🔗 **Demo:** _(link da Vercel será adicionado após o deploy de produção)_

## O que este sistema é

- Cadastro de colaboradores com nome, setor e situação (Ativo/Inativo)
- Dois perfis de demonstração: **Edição** e **Só leitura**, sem senha real
- Busca por nome e filtro por situação
- Inativação com desfazer, em vez de exclusão definitiva
- Histórico de alterações em cada colaborador (quem, quando, o quê)

## O que este sistema não é

- Não tem autenticação corporativa real (login/senha, SSO)
- Não tem dashboard, relatórios em PDF ou múltiplos módulos

## Stack

- React + TypeScript (Vite)
- Tailwind CSS
- Firebase Firestore (banco de dados)
- Funções serverless da Vercel (`api/`) com Firebase Admin SDK
- Deploy: Vercel