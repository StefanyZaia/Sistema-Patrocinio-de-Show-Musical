import servidor from "./servidor";
export function servicoCadastrarProdutor(produtor) { return servidor.post("/produtores", produtor); };
export function servicoBuscarProdutor(cpf) { return servidor.get(`/produtores/${cpf}`); };
export function servicoAtualizarProdutor(produtor) { return servidor.patch("/produtores", produtor); };
export function servicoCadastrarShow(show) {
    return servidor.post("/produtores/shows", show);
};
export function servicoAlterarShow(show) {
    return servidor.patch("/produtores/shows", show);
};
export function servicoRemoverShow(id) {
    return servidor.delete(`/produtores/shows/${id}`);
};
export function servicoBuscarShowsProdutor(cpf) {
    return servidor.get(`/produtores/shows/produtor/${cpf}`);
};
export function servicoBuscarLocalizacaoShows() {
    return servidor.get("/produtores/shows/localizacao");
};
export function servicoBuscarPrioridadesShow(id_show) {
    return servidor.get(`/produtores/prioridades/${id_show}`);
};