import md5 from "md5";
import { getManager } from "typeorm";
import Usuario, { Status } from "../entidades/usuario";
import Patrocinador from '../entidades/patrocinador';
import ServicosUsuario from "./servicos-usuario";
import Show from "../entidades/show";
import Prioridade from "../entidades/prioridade";
export default class ServicosPatrocinador {
    constructor() { }
    static async cadastrarPatrocinador(request, response) {
        try {
            const { usuario_info, tipo, ano_inicio_patrocinio, data_inicio_empresa, telefone } = request.body;
            const { usuario, token } = await ServicosUsuario.cadastrarUsuario(usuario_info);
            const entityManager = getManager();
            await entityManager.transaction(async (transactionManager) => {
                await transactionManager.save(usuario);
                const patrocinador = Patrocinador.create({ usuario, tipo, ano_inicio_patrocinio, data_inicio_empresa, telefone });
                await transactionManager.save(patrocinador);
                await transactionManager.update(Usuario, usuario.cpf, { status: Status.ATIVO });
                return response.json({ status: Status.ATIVO, token });
            });
        } catch (error) { return response.status(500).json({ erro: error }); }
    };
    static async atualizarPatrocinador(request, response) {
        try {
            const { cpf, tipo, ano_inicio_patrocinio, data_inicio_empresa, telefone } = request.body;
            const cpf_encriptado = md5(cpf);
            await Patrocinador.update({ usuario: { cpf: cpf_encriptado } }, {
                tipo, ano_inicio_patrocinio,
                data_inicio_empresa, telefone
            });
            return response.json();
        } catch (error) { return response.status(500).json({ erro: "Erro BD : atualizarPatrocinador" }); }
    };
    static async buscarPatrocinador(request, response) {
        try {
            const cpf_encriptado = md5(request.params.cpf);
            const patrocinador = await Patrocinador.findOne({
                where: { usuario: cpf_encriptado },
                relations: ["usuario"]
            });
            if (!patrocinador) return response.status(404).json({ erro: "Patrocinador não encontrado." });
            return response.json({
                nome: patrocinador.usuario.nome, email: patrocinador.usuario.email,
                tipo: patrocinador.tipo, ano_inicio_patrocinio: patrocinador.ano_inicio_patrocinio,
                data_inicio_empresa: patrocinador.data_inicio_empresa, telefone: patrocinador.telefone
            });
        } catch (error) { return response.status(500).json({ erro: "Erro BD : buscarPatrocinador" }); }
    };
    static async cadastrarPrioridade(request, response) {
        try {
            const { id_show, justificativa, cpf, nivel_prioridade } = request.body;
            const cpf_encriptado = md5(cpf);
            const patrocinador = await Patrocinador.findOne({ where: { usuario: cpf_encriptado } });
            const show = await Show.findOne(id_show);
            const prioridades = await Prioridade.find({ where: { patrocinador, show } });
    
            if (prioridades.length > 0)
                return response.status(404).json({ erro: "O patrocinador ja cadastrou prioridade para o show." });
    
            await Prioridade.create({ justificativa, patrocinador, show, nivel_prioridade }).save();
    
            return response.json();
        } catch (error) {
            console.error("Erro ao cadastrar prioridade:", error);
            return response.status(500).json({ erro: "Erro BD : cadastrarPrioridade" });
        }
    }    
    static async removerPrioridade(request, response) {
        try {
            const id = request.params.id;
            await Prioridade.delete(id);
            return response.json();
        } catch (error) { return response.status(500).json({ erro: "Erro BD : removerPrioridade" }); }
    };
    static async buscarPrioridadesPatrocinador(request, response) {
        try {
            const cpf_encriptado = md5(request.params.cpf);
            const prioridades = await Prioridade.find({
                where: { patrocinador: { usuario: cpf_encriptado } },
                relations: ["patrocinador", "patrocinador.usuario", "show", "show.produtor",
                    "show.produtor.usuario"]
            });
            return response.json(prioridades);
        } catch (error) {
            return response.status(500).json
                ({ erro: "Erro BD : buscarPrioridadesPatrocinador" });
        }
    };
    static async buscarShows(request, response) {
        try {
            const shows = await Show.find({ relations: ["produtor", "produtor.usuario"] });
            return response.json(shows);
        } catch (error) { return response.status(500).json({ erro: "Erro BD : buscarShows" }); }
    };
}