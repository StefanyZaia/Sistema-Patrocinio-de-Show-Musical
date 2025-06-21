import md5 from "md5";
import { getManager } from "typeorm";
import Usuario, { Status } from "../entidades/usuario";
import Produtor, { Atuacao } from "../entidades/produtor";
import ServicosUsuario from "./servicos-usuario";
import Show from "../entidades/show";
import Prioridade from "src/entidades/prioridade";
export default class ServicosProdutor {
    constructor() { }
    static async cadastrarProdutor(request, response) {
        try {
            const { usuario_info, atuacao, anos_experiencia } = request.body;
            const { usuario, token } = await ServicosUsuario.cadastrarUsuario(usuario_info);
            const entityManager = getManager();
            await entityManager.transaction(async (transactionManager) => {
                await transactionManager.save(usuario);
                const produtor = Produtor.create({ usuario, atuacao, anos_experiencia });
                await transactionManager.save(produtor);
                await transactionManager.update(Usuario, usuario.cpf, { status: Status.ATIVO });
                return response.json({ status: Status.ATIVO, token });
            });
        } catch (error) {
            return response.status(500).json({ erro: error });
        }
    };
    static async buscarProdutor(request, response) {
        try {
            const cpf_encriptado = md5(request.params.cpf);
            const produtor = await Produtor.findOne({
                where: { usuario: cpf_encriptado },
                relations: ["usuario"]
            });
            if (!produtor) return response.status(404).json({ erro: "Produtor nao encontrado." });
            return response.json({
                nome: produtor.usuario.nome, email: produtor.usuario.email,
                atuacao: produtor.atuacao,
                anos_experiencia: produtor.anos_experiencia
            });
        } catch (error) { return response.status(500).json({ erro: "Erro BD : buscarProdutor" }); }
    }
    static async atualizarProdutor(request, response) {
        try {
            const { cpf, atuacao, anos_experiencia } = request.body;
            const cpf_encriptado = md5(cpf);
            await Produtor.update({ usuario: { cpf: cpf_encriptado } },
                { atuacao, anos_experiencia });
            return response.json();
        } catch (error) { return response.status(500).json({ erro: "Erro BD : atualizarProdutor" }); }
    };
    static async cadastrarShow(request, response) {
        try {
            const { nome_show, genero_musical, localizacao, data_show, descricao, show_gratuito, categoria,
                cpf } = request.body;
            const cpf_encriptado = md5(cpf);
            const produtor = await Produtor.findOne({
                where: { usuario: cpf_encriptado },
                relations: ["usuario"]
            });
            await Show.create({
                nome_show, genero_musical, localizacao, data_show, descricao, show_gratuito,
                categoria, produtor
            }).save();
            return response.json();
        } catch (error) { return response.status(500).json({ erro: "Erro BD : cadastrarShow" }); }
    };
    static async alterarShow(request, response) {
        try {
            const { id, nome_show, genero_musical, localizacao, data_show, descricao, show_gratuito,
                categoria } = request.body;
            await Show.update(id, {
                nome_show, genero_musical, localizacao, data_show, descricao, show_gratuito,
                categoria
            });
            return response.json();
        } catch (error) { return response.status(500).json({ erro: "Erro BD : alterarShow" }); }
    };
    static async removerShow(request, response) {
        try {
            const id_show = request.params.id;
            const show = await Show.findOne(id_show);
            await Show.remove(show);
            return response.json();
        } catch (error) { return response.status(500).json({ erro: "Erro BD : removerShow" }); }
    };
    static async buscarShowsProdutor(request, response) {
        try {
            const cpf_encriptado = md5(request.params.cpf);
            const shows = await Show.find({
                where: { produtor: { usuario: cpf_encriptado } },
                relations: ["produtor", "produtor.usuario"]
            });
            return response.json(shows);
        } catch (error) {
            return response.status(500).json
                ({ erro: "Erro BD : buscarShowsProdutor" });
        }
    };
    static filtrarLocalizacaoEliminandoRepeticao(show: Show[]) {
        let localizacao: { label: string, value: string }[];
        localizacao = show.filter((show, indice, shows_antes_filtrar) =>
            shows_antes_filtrar.findIndex
                (show_anterior => show_anterior.localizacao === show.localizacao) === indice)
            .map(show => ({ label: show.localizacao, value: show.localizacao }));
        return localizacao;
    };
    static async buscarLocalizacaoShows(request, response) {
        try {
            const shows = await Show.find();
            const localizacao = ServicosProdutor.filtrarLocalizacaoEliminandoRepeticao(shows);
            return response.json(localizacao.sort());
        } catch (error) {
            return response.status(500).json
                ({ erro: "Erro BD : buscarLocalizacaoShows" });
        }
    };
    static async buscarPrioridadesShow(request, response) {
        try {
            const id_show = request.params.id_show;
            const prioridades = await Prioridade.find({
                where: { show: { id: id_show } },
                relations: ["patrocinador", "patrocinador.usuario", "show"]
            });
            return response.json(prioridades);
        } catch (error) {
            return response.status(500).json(
                { erro: "Erro BD : buscarPrioridadesShow" });
        }
    };
};