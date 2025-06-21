import { Router } from "express";
import ServicosUsuario from "../servicos/servicos-usuario";
import verificarToken from "../middlewares/verificar-token";
import verificarErroConteudoToken from "../middlewares/verificar-erro-conteudo-token";
const RotasUsuario = Router();
export default RotasUsuario;
RotasUsuario.post("/login", ServicosUsuario.logarUsuario);
RotasUsuario.post("/verificar-cpf/:cpf", ServicosUsuario.verificarCpfExistente);
RotasUsuario.patch("/alterar-usuario", verificarToken, ServicosUsuario.alterarUsuario);
RotasUsuario.delete("/:cpf", verificarToken, verificarErroConteudoToken,
    ServicosUsuario.removerUsuario);
RotasUsuario.get("/questao/:cpf", ServicosUsuario.buscarQuestaoSeguranca);
RotasUsuario.post("/verificar-resposta", ServicosUsuario.verificarRespostaCorreta);