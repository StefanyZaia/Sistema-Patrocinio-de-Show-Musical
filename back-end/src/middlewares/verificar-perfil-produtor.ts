import { Perfil } from "../entidades/usuario";
export default function verificarPerfilProdutor(request, response, next) {
    if (request.perfil === Perfil.PRODUTOR) return next();
    else return response.status(401).json({ erro: "Acesso nao autorizado." });
};