# BNCC Play

Plataforma educacional gamificada para apoio ao ensino de Computação na Educação Básica, alinhada às diretrizes da BNCC Computação.

---

## Sobre o Projeto

O **BNCC Play** é uma plataforma desenvolvida com o objetivo de auxiliar professores e estudantes no processo de ensino e aprendizagem de conteúdos relacionados à Computação de forma dinâmica, acessível e gamificada.

A proposta do sistema é organizar atividades, perguntas, desafios e conteúdos pedagógicos com base nos eixos da BNCC Computação, permitindo que o professor selecione previamente o eixo desejado antes do início das atividades.

O sistema busca fortalecer competências relacionadas a:

* Pensamento computacional
* Resolução de problemas
* Raciocínio lógico
* Aprendizagem ativa
* Gamificação educacional

Além disso, o projeto foi pensado para oferecer uma experiência simples, intuitiva e acessível para utilização em ambiente escolar.

---

# Objetivos

* Apoiar o ensino de Computação na Educação Básica
* Tornar as aulas mais interativas e gamificadas
* Facilitar a organização pedagógica de conteúdos
* Incentivar a participação ativa dos estudantes
* Permitir expansão modular baseada na BNCC Computação

---

# Principais Funcionalidades

* Seleção de eixo da BNCC Computação
* Organização de conteúdos por eixo temático
* Sistema gamificado de perguntas e respostas
* Cadastro dinâmico de questões
* Organização de questões por categorias
* Níveis de dificuldade
* Filtragem de conteúdos por eixo
* Interface voltada para professores e estudantes
* Estrutura modular e escalável
* Plataforma de apoio pedagógico

---

# Estrutura Modular

O sistema foi projetado para suportar múltiplos eixos da BNCC Computação, permitindo expansão futura de conteúdos e atividades.

Exemplo de estrutura:

```text
BNCC Play
├── Eixo 1
│   ├── Categorias
│   ├── Questões
│   ├── Desafios
│   └── Níveis
├── Eixo 2
├── Eixo 3
└── ...
```

---

# Público-Alvo

* Professores da Educação Básica
* Estudantes
* Instituições de ensino
* Projetos educacionais
* Pesquisadores na área de Educação e Computação

---

# Tecnologias Utilizadas

## Frontend

* React
* TypeScript
* Vite
* TailwindCSS

## Backend

* FastAPI
* Python
* SQLAlchemy
* Pydantic

## Banco de Dados

* PostgreSQL

---

# Arquitetura do Projeto

```text
frontend/
├── src/
├── components/
├── pages/
├── services/
└── styles/

backend/
├── app/
├── routers/
├── models/
├── schemas/
├── services/
└── database/
```

---

# UX/UI

O projeto considera princípios de UX/UI para garantir:

* Facilidade de uso
* Navegação intuitiva
* Organização visual clara
* Boa experiência em ambiente escolar
* Interface acessível para alunos e professores

---

# Futuras Melhorias

* Ranking de jogadores/alunos
* Sistema de pontuação e recompensas
* Dashboard pedagógico
* Relatórios de desempenho
* Multiplayer em sala
* Integração com plataformas educacionais
* Exportação de relatórios
* Sistema de turmas
* Autenticação de professores e alunos

---

# Como Executar o Projeto

## Pré-requisitos

* Node.js
* Python 3.11+
* PostgreSQL

---

## Frontend

```bash
cd frontend

npm install

npm run dev
```

---

## Backend

```bash
cd backend

python -m venv venv

source venv/bin/activate
```

### Instalar dependências

```bash
pip install -r requirements.txt
```

### Executar API

```bash
uvicorn app.main:app --reload
```

---

# Variáveis de Ambiente

## Backend `.env`

```env
DATABASE_URL=postgresql://user:password@localhost:5432/bncc_play
SECRET_KEY=your_secret_key
```

---

# Contribuição

Contribuições são bem-vindas.

## Passos

1. Faça um fork do projeto

2. Crie uma branch:

```bash
git checkout -b feature/minha-feature
```

3. Commit suas alterações:

```bash
git commit -m "feat: minha nova feature"
```

4. Envie para sua branch:

```bash
git push origin feature/minha-feature
```

5. Abra um Pull Request

---

# Licença

Este projeto está sob a licença MIT.

---

# Autor

Desenvolvido por **Nataniel Cesar** e Diogo Mendonça de Almeida Oliveira, Fernanda Rodrigues da Silva, Gustavo Coutinho Soares, Luiz Gustavo dos Santos Silva e Marcos Antonio Jose da Silva.
