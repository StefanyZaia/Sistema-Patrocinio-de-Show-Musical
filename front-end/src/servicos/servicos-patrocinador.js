import servidor from "./servidor";
export function servicoCadastrarPatrocinador(patrocinador) { return servidor.post("/patrocinadores", patrocinador); };
export function servicoAtualizarPatrocinador(patrocinador) { return servidor.patch("/patrocinadores", patrocinador); };
export function servicoBuscarPatrocinador(cpf) { return servidor.get(`/patrocinadores/${cpf}`); };
export function servicoCadastrarPrioridade(prioridade) {
    return servidor.post("/patrocinadores/prioridades", prioridade);
};
export function servicoRemoverPrioridade(id) { return servidor.delete(`/patrocinadores/prioridades/${id}`); };
export function servicoBuscarPrioridadesPatrocinador(cpf) {
    return servidor.get(`/patrocinadores/prioridades/patrocinador/${cpf}`);
};
export function servicoBuscarShows() { return servidor.get("/patrocinadores/prioridades/show"); };