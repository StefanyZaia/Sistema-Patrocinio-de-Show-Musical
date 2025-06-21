# Sistema-Patrocinio-de-Show-Musical

Este projeto modela um sistema de gerenciamento de shows com foco em Produtores, Patrocinadores e Usuários. Abaixo estão os detalhes sobre as entidades, relacionamentos, atributos, enums e filtros disponíveis.

---

## 🧩 Entidades e Relacionamentos

### Entidades
- **Usuário**
- **Produtor**
- **Patrocinador**
- **Show**
- **Prioridade**

### Relacionamentos
- `Produtor [1:n] Show`
- `Patrocinador [1:n] Prioridade`
- `Prioridade`: relação entre `Patrocinador` e `Show`

---

## 🗂️ Atributos e Referências

### Usuário
- **cpf** (chave primária)
- nome
- email
- perfil
- status
- senha
- questão
- resposta
- cor_tema

### Produtor
- atuação
- anos_experiência
- **usuário** (referência)
- shows

### Patrocinador
- tipo
- ano_inicio_patrocinio
- data_início_empresa
- telefone
- **usuário** (referência)
- prioridades

### Show
- **id** (chave primária)
- nome_show
- gênero_musical
- localização
- data_show
- descrição
- show_gratuito
- categoria
- **produtor** (referência)
- prioridades

### Prioridade
- **id** (chave primária)
- nível_prioridade
- justificativa
- data_avaliação
- **patrocinador** (referência)
- **show** (referência)

---

## 📊 Enumerados

### Usuário
- **Perfil**: `produtor`, `patrocinador`
- **Status**: `ativo`, `inativo`, `pendente`
- **Cores**: `amarelo`, `anil`, `azul`, `azul_piscina`, `cinza_escuro`, `laranja`, `rosa`, `roxo`, `verde`, `verde_azulado`

### Produtor
- **Atuação**: `tecnico`, `criativo`

### Patrocinador
- **Tipo**: `financeiro`, `produtos`

### Show
- **Gênero Musical**: `post-hardcore`, `metalcore`, `pop punk`
- **Categoria**: `festival`, `solo`, `beneficente`

---

## 🔍 Filtros: Administração e Pesquisa

### Produtor

#### Gerenciar Shows
- nome_show
- localização
- data_show
- categoria
- show_gratuito

#### Pesquisar Prioridades
- nome_patrocinador
- nome_show
- nível_prioridade
- data_show

### Patrocinador

#### Gerenciar Prioridades
- nome_produtor
- nível_prioridade
- localização
- data_show

#### Pesquisar Shows
- nome_produtor
- localização_show
- data_show
- produtor
- categoria
- show_gratuito

---

## 📌 Observações

Este modelo visa representar uma estrutura relacional clara e escalável para um sistema de gerenciamento de shows. Ele pode ser facilmente integrado a sistemas de autenticação, dashboards administrativos e APIs RESTful.

---

## 🛠️ Tecnologias Sugeridas
- **Backend**: Node.js / Spring Boot / Django
- **Frontend**: React / Angular
- **Banco de Dados**: PostgreSQL / MySQL
