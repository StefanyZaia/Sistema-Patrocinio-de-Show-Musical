import bcrypt from "bcrypt";
import dotenv from 'dotenv';
import md5 from "md5";
import { sign } from "jsonwebtoken";
import Usuario, { Perfil } from "../entidades/usuario";
import Produtor from "../entidades/produtor";
import Patrocinador from "../entidades/patrocinador";
import { getManager } from "typeorm";
dotenv.config();
const SALT = 10;
const SENHA_JWT = process.env.SENHA_JWT;
export default class ServicosUsuario {
    constructor() { }
    static async verificarCpfExistente(request, response) {
        try {
            const cpf_encriptado = md5(request.params.cpf);

            const usuario = await Usuario.findOne(cpf_encriptado);

            if (usuario) {
                return response.status(404).json({ erro: "CPF ja cadastrado." });
            } else {
                return response.json();
            }
        } catch (error) {
            console.error("Erro no servidor:", error);
            return response.status(500).json({ erro: "Erro BD: verificarCpfCadastrado" });
        }
    }
    static async verificarCadastroCompleto(usuario: Usuario) {
        switch (usuario.perfil) {
            case Perfil.PRODUTOR:
                const produtor = await Produtor.findOne({
                    where: { usuario: usuario.cpf },
                    relations: ["usuario"]
                });
                if (!produtor) return false;
                return true;
            case Perfil.PATROCINADOR:
                const patrocinador = await Patrocinador.findOne({
                    where: { usuario: usuario.cpf },
                    relations: ["usuario"]
                });
                if (!patrocinador) return false;
                return true;
            default: return;
        }
    };
    static async logarUsuario(request, response) {
        try {
            const { nome_login, senha } = request.body;
            const cpf_encriptado = md5(nome_login);
            const usuario = await Usuario.findOne(cpf_encriptado);
            if (!usuario) return response.status(404).json({ erro: "Nome de usuario nao cadastrado." });
            const cadastro_completo = await ServicosUsuario.verificarCadastroCompleto(usuario);
            if (!cadastro_completo) {
                await Usuario.remove(usuario);
                return response.status(400).json
                    ({ erro: "Cadastro incompleto. Por favor, realize o cadastro novamente." });
            }
            const senha_correta = await bcrypt.compare(senha, usuario.senha);
            if (!senha_correta) return response.status(401).json({ erro: "Senha incorreta." });
            const token = sign({ perfil: usuario.perfil, email: usuario.email }, SENHA_JWT,
                { subject: usuario.nome, expiresIn: "1d" });
            return response.json({
                usuarioLogado: {
                    nome: usuario.nome, perfil: usuario.perfil,
                    email: usuario.email, questao: usuario.questao, status: usuario.status,
                    cor_tema: usuario.cor_tema, token
                }
            });
        } catch (error) { return response.status(500).json({ erro: "Erro BD: logarUsuario" }); }
    };
    static async cadastrarUsuario(usuario_informado) {
        try {
            const { cpf, nome, perfil, email, senha, questao, resposta, cor_tema } = usuario_informado;
            const cpf_encriptado = md5(cpf);
            const senha_encriptada = await bcrypt.hash(senha, SALT);
            const resposta_encriptada = await bcrypt.hash(resposta, SALT);
            const usuario = Usuario.create({
                cpf: cpf_encriptado, nome, perfil, email,
                senha: senha_encriptada, questao,
                resposta: resposta_encriptada, cor_tema
            });
            const token = sign({ perfil: usuario.perfil, email: usuario.email }, SENHA_JWT,
                { subject: usuario.nome, expiresIn: "1d" });
            return { usuario, senha, token };
        } catch (error) {
            throw new Error("Erro BD: cadastrarUsuario");
        };

    }
    static async alterarUsuario(request, response) {
        try {
            const { cpf, senha, questao, resposta, cor_tema, email } = request.body;
            const cpf_encriptado = md5(cpf);
            let senha_encriptada: string, resposta_encriptada: string;
            let token: string;
            const usuario = await Usuario.findOne(cpf_encriptado);
            if (email) {
                usuario.email = email;
                token = sign({ perfil: usuario.perfil, email }, SENHA_JWT,
                    { subject: usuario.nome, expiresIn: "1d" });
            }
            if (cor_tema) usuario.cor_tema = cor_tema;
            if (senha) {
                senha_encriptada = await bcrypt.hash(senha, SALT);
                usuario.senha = senha_encriptada;
            }
            if (resposta) {
                resposta_encriptada = await bcrypt.hash(resposta, SALT);
                usuario.questao = questao;
                usuario.resposta = resposta_encriptada;
            }
            await Usuario.save(usuario);
            const usuario_info = {
                nome: usuario.nome, perfil: usuario.perfil, email: usuario.email,
                questao: usuario.questao, status: usuario.status, cor_tema: usuario.cor_tema, token: null
            };
            if (token) usuario_info.token = token;
            return response.json(usuario_info);
        } catch (error) { return response.status(500).json({ erro: "Erro BD: alterarUsuario" }); }
    };
    static async removerUsuario(request, response) {
        try {
            const cpf_encriptado = md5(request.params.cpf);
            const entityManager = getManager();
            await entityManager.transaction(async (transactionManager) => {
                const usuario = await transactionManager.findOne(Usuario, cpf_encriptado);
                await transactionManager.remove(usuario);
                return response.json();
            });
        } catch (error) {
            return response.status(500).json({ erro: "Erro BD: removerUsuario" });
        }
    };
    static async buscarQuestaoSeguranca(request, response) {
        try {
            const cpf_encriptado = md5(request.params.cpf);
            const usuario = await Usuario.findOne(cpf_encriptado);
            if (usuario) return response.json({ questao: usuario.questao });
            else return response.status(404).json({ mensagem: "CPF nao cadastrado" });
        } catch (error) {
            return response.status(500).json
                ({ erro: "Erro BD : buscarQuestaoSeguranca" });
        }
    };
    static async verificarRespostaCorreta(request, response) {
        try {
            const { cpf, resposta } = request.body;
            const cpf_encriptado = md5(cpf);
            const usuario = await Usuario.findOne(cpf_encriptado);
            const resposta_correta = await bcrypt.compare(resposta, usuario.resposta);
            if (!resposta_correta) return response.status(401).json({ mensagem: "Resposta incorreta." });
            const token = sign({ perfil: usuario.perfil, email: usuario.email },
                process.env.SENHA_JWT, { subject: usuario.nome, expiresIn: "1h" });
            return response.json({ token });
        } catch (error) {
            return response.status(500).json({ erro: "Erro BD: verificarRespostaCorreta" });
        }
    };
};