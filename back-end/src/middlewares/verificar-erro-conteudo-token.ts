import md5 from "md5";
import Usuario from "../entidades/usuario";
export default async function verificarErroConteudoToken(request, response, next) {
    const cpf_encriptado = md5(request.params.cpf || request.body.cpf);
    const usuario_token = await Usuario.findOne({ where: { email: request.email_token } });
    const usuario = await Usuario.findOne({ where: { cpf: cpf_encriptado } });
    if (usuario_token.email !== usuario.email) return response.status(401).json
        ("Acesso não autorizado.");
    next();
}