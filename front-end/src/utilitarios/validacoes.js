import { estilizarErro } from "./estilos";
const ERRO_CAMPO_OBRIGATORIO = "Campo obrigatorio nao preenchido";
const ERRO_CONFIRMAcAO_SENHA = "Senha nao confere";
const ERRO_FORMATO_INVaLIDO = "Campo com formato invalido";
const ERRO_QUESTAO = "Resposta sem questao";
export function validarCamposObrigatorios(campos) {
    let errosCamposObrigatorios = {};
    for (let nomeCampo in campos) {
        if (campos[nomeCampo] === "" || campos[nomeCampo] === null)
            errosCamposObrigatorios[nomeCampo] = ERRO_CAMPO_OBRIGATORIO;
    }
    return errosCamposObrigatorios;
};
export function validarConfirmacaoSenha(senha, confirmacao_senha) {
    let errosConfirmacaoSenhaOpcional = {};
    if (senha !== confirmacao_senha) {
        errosConfirmacaoSenhaOpcional.confirmacao_senha = ERRO_CONFIRMAcAO_SENHA;
    }
    return errosConfirmacaoSenhaOpcional;
};
export function validarConfirmacaoSenhaOpcional(senha, confirmacao_senha) {
    let errosConfirmacaoSenhaOpcional = {};
    if (senha && confirmacao_senha && senha !== confirmacao_senha) {
        errosConfirmacaoSenhaOpcional.confirmacaoSenha = ERRO_CONFIRMAcAO_SENHA;
    }
    return errosConfirmacaoSenhaOpcional;
};
export function validarCampoEmail(email) {
    const FORMATO_EMAIL = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{3}(\.\w{2})?)$/;
    let erroEmail = {};
    if (!email) erroEmail.email = ERRO_CAMPO_OBRIGATORIO;
    else if (!FORMATO_EMAIL.test(email)) erroEmail.email = ERRO_FORMATO_INVaLIDO;
    return erroEmail;
};
export function validarRecuperacaoAcessoOpcional(questao, resposta) {
    let errosRecuperacaoAcessoOpcional = {};
    if (resposta && !questao) errosRecuperacaoAcessoOpcional.questao = ERRO_QUESTAO;
    return errosRecuperacaoAcessoOpcional;
};
export function checarListaVazia(listaErros) {
    return Object.keys(listaErros).length === 0
};
export function MostrarMensagemErro({ mensagem }) {
    if (mensagem) return <small className={estilizarErro()}>{mensagem}</small>;
    else return null;
};
export function validarCpf(cpf) {
    cpf = cpf.replace(/[^\d]/g, '');
    if (cpf.length === 11) return true;
    return false;
    };