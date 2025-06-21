import { Router } from "express";
import verificarToken from "../middlewares/verificar-token";
import verificarPerfilProdutor from "../middlewares/verificar-perfil-produtor";
import ServicosProdutor from "../servicos/servicos-produtor";
import verificarErroConteudoToken from "../middlewares/verificar-erro-conteudo-token";
const RotasProdutor = Router();
export default RotasProdutor;
RotasProdutor.post("/", ServicosProdutor.cadastrarProdutor);
RotasProdutor.get("/:cpf", verificarToken, verificarPerfilProdutor,
    ServicosProdutor.buscarProdutor);
RotasProdutor.patch("/", verificarToken, verificarPerfilProdutor,
    ServicosProdutor.atualizarProdutor);
RotasProdutor.post("/shows", verificarToken, verificarPerfilProdutor,
    ServicosProdutor.cadastrarShow);
RotasProdutor.patch("/shows", verificarToken, verificarPerfilProdutor,
    ServicosProdutor.alterarShow);
RotasProdutor.delete("/shows/:id", verificarToken, verificarPerfilProdutor,
    ServicosProdutor.removerShow);
RotasProdutor.get("/shows/produtor/:cpf", verificarToken, verificarPerfilProdutor,
    verificarErroConteudoToken, ServicosProdutor.buscarShowsProdutor);
RotasProdutor.get("/shows/localizacao", verificarToken, verificarPerfilProdutor,
    ServicosProdutor.buscarLocalizacaoShows);
RotasProdutor.get("/prioridades/:id_show", verificarToken, verificarPerfilProdutor,
    ServicosProdutor.buscarPrioridadesShow);