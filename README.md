# Site-Patrocinio-de-Show-Musical

Entidades : Relacionamentos
-Usuário
--Produtor
--Patrocinador
-Produtor [1:n] Show
-Patrocinador [1:n] Prioridade
-Prioridade : Patrocinador - Show

Entidades : Atributos e Referências (chaves sublinhadas -- referências em negrito)
-Usuário : cpf, nome, email, perfil, status, senha, questão, resposta, cor_tema
--Produtor :  atuação, anos_experiência, shows, usuário
--Patrocinador : tipo, ano_inicio_patrocinio, data_início_empresa, telefone, prioridades, usuário
--Show : id, nome_show, gênero_musical, localização, data_show, descrição, show_gratuito, categoria, produtor, prioridades
--Prioridade : id, nível_prioridade, justificativa, data_avaliação, patrocinador, show

Entidades : Enumerados
-Usuário
--Perfil : produtor, patrocinador
--Status : ativo, inativo, pendente
--Cores : amarelo, anil, azul, azul_piscina, cinza_escuro, laranja, rosa, roxo, verde, verde_azulado
-Produtor
--Atuação : tecnico, criativo
-Patrocinador
--Tipo : financeiro, produtos
-Show
--gênero_musical : post-hardcore, metalcore, pop punk
--categoria: festival, solo, beneficente

Filtros : Administrar e Pesquisar
-Produtor
--GerenciarShows
nome_show, localização, data_show, categoria, show_gratuito
--PesquisarPrioridades
nome_patrocinador, nome_show, nível_prioridade, data_show
-Patrocinador
--GerenciarPrioridades
nome_produtor, nível_prioridade, localização, data_show
--PesquisarShows
nome_produtor, localização_show, data_show, produtor, categoria, show_gratuito
