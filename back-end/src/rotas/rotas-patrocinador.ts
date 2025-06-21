import { Router } from "express";
import verificarToken from "../middlewares/verificar-token";
import verificarPerfilPatrocinador from "../middlewares/verificar-perfil-patrocinador";
import ServicosPatrocinador from "../servicos/servicos-patrocinador";
import verificarErroConteudoToken from "../middlewares/verificar-erro-conteudo-token";
const RotasPatrocinador = Router();
export default RotasPatrocinador;
RotasPatrocinador.post("/", ServicosPatrocinador.cadastrarPatrocinador);
RotasPatrocinador.get("/:cpf", verificarToken, verificarPerfilPatrocinador,
    ServicosPatrocinador.buscarPatrocinador);
RotasPatrocinador.patch("/", verificarToken, verificarPerfilPatrocinador,
    ServicosPatrocinador.atualizarPatrocinador);
RotasPatrocinador.post("/prioridades/", verificarToken, verificarPerfilPatrocinador,
    ServicosPatrocinador.cadastrarPrioridade);
RotasPatrocinador.delete("/prioridades/:id", verificarToken, verificarPerfilPatrocinador,
    ServicosPatrocinador.removerPrioridade);
RotasPatrocinador.get("/prioridades/patrocinador/:cpf", verificarToken, verificarPerfilPatrocinador,
    verificarErroConteudoToken, ServicosPatrocinador.buscarPrioridadesPatrocinador);
RotasPatrocinador.get("/prioridades/show/", verificarToken, verificarPerfilPatrocinador,
    ServicosPatrocinador.buscarShows);