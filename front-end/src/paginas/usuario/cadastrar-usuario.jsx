import { useContext, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Dialog } from "primereact/dialog";
import { Divider } from "primereact/divider";
import { Dropdown } from "primereact/dropdown";
import { InputMask } from "primereact/inputmask";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Toast } from "primereact/toast";
import ContextoUsuario from "../../contextos/contexto-usuario";
import ModalConfirmacaoUsuario from "../../componentes/modais/modal-confirmacao-usuario";
import mostrarToast from "../../utilitarios/mostrar-toast";
import { CPF_MASCARA } from "../../utilitarios/mascaras";
import {
    MostrarMensagemErro, checarListaVazia, validarCampoEmail, validarCamposObrigatorios,
    validarConfirmacaoSenha, validarConfirmacaoSenhaOpcional, validarRecuperacaoAcessoOpcional
}
    from "../../utilitarios/validacoes";
import {
    TAMANHOS, TEMA_PADRAO, estilizarBotao, estilizarBotaoRemover, estilizarCard, estilizarDialog,
    estilizarDivBotoesAcao, estilizarDivCampo, estilizarDivider, estilizarDropdown, estilizarFlex,
    estilizarFooterDialog, estilizarInputMask, estilizarInputText, estilizarLabel, estilizarLink,
    estilizarPasswordInput, estilizarPasswordTextInputBorder, estilizarSubtitulo, opcoesCores
}
    from "../../utilitarios/estilos";
import { servicoVerificarCpfExistente } from "../../servicos/servicos-usuario";
export default function CadastrarUsuario() {
    const referenciaToast = useRef(null);
    const { usuarioLogado, mostrarModalConfirmacao, setMostrarModalConfirmacao, setConfirmacaoUsuario }
        = useContext(ContextoUsuario);
    const [dados, setDados] = useState({
        cpf: usuarioLogado?.cpf || "",
        nome: usuarioLogado?.nome || "", perfil: usuarioLogado?.perfil || "",
        email: usuarioLogado?.email || "", senha: "", confirmacao: "",
        questao: usuarioLogado?.questao || "", resposta: "",
        cor_tema: usuarioLogado?.cor_tema || TEMA_PADRAO
    });
    const [erros, setErros] = useState({});
    const opcoesPerfis = [{ label: "Produtor", value: "produtor" },
    { label: "Patrocinador", value: "patrocinador" }];
    function alterarEstado(event) {
        const chave = event.target.name;
        const valor = event.target.value;
        setDados({ ...dados, [chave]: valor });
    };
    function validarCamposAdministrar() {
        const { email, senha, confirmacao, questao, resposta } = dados;
        let errosCamposObrigatorios = validarCamposObrigatorios({ email });
        let errosValidacaoEmail = validarCampoEmail(email);
        let errosConfirmacaoSenhaOpcional = validarConfirmacaoSenhaOpcional(senha, confirmacao);
        let errosRecuperacaoAcessoOpcional = validarRecuperacaoAcessoOpcional(questao, resposta);
        setErros({
            ...errosCamposObrigatorios, ...errosConfirmacaoSenhaOpcional,
            ...errosRecuperacaoAcessoOpcional, ...errosValidacaoEmail
        });
        return checarListaVazia(errosCamposObrigatorios)
            && checarListaVazia(errosConfirmacaoSenhaOpcional)
            && checarListaVazia(errosValidacaoEmail) && checarListaVazia(errosRecuperacaoAcessoOpcional);
    };
    function validarCamposCadastrar() {
        const { perfil, cpf, nome, questao, resposta, senha, confirmacao, email } = dados;
        console.log("CadastrarUsuario.validarCamposCadastrar:dados.nome -- " + dados.nome);
        console.log(JSON.parse(JSON.stringify(dados)));
        if (!usuarioLogado?.perfil) {
            let errosCamposObrigatorios = validarCamposObrigatorios
                ({ perfil, cpf, nome, questao, resposta, senha, confirmacao, email });
            let errosValidacaoEmail = validarCampoEmail(email);
            let errosConfirmacaoSenha = validarConfirmacaoSenha(senha, confirmacao);
            setErros({ ...errosCamposObrigatorios, ...errosConfirmacaoSenha, ...errosValidacaoEmail });
            return checarListaVazia(errosCamposObrigatorios) && checarListaVazia(errosConfirmacaoSenha)
                && checarListaVazia(errosValidacaoEmail);
        }
    };
    function validarCampos() {
        if (!usuarioLogado?.perfil) return validarCamposCadastrar();
        else return validarCamposAdministrar();
    };
    function tituloFormulario() {
        if (!usuarioLogado?.perfil) return "Alterar Usuario";
        else return "Alterar Usuario";
    };
    function validarConfirmarAlteracao() {
        const camposValidos = validarCampos();
        if (camposValidos) confirmarOperacao("alterar");
    };
    function textoRetorno() {
        if (!usuarioLogado?.perfil) return "Retornar para login";
        else return "Retornar para pagina inicial";
    };
    function linkRetorno() {
        if (!usuarioLogado?.perfil) return "/";
        else return "/pagina-inicial";
    };
    function limparOcultar() {
        setConfirmacaoUsuario(null);
        setMostrarModalConfirmacao(false);
    };
    async function validarConfirmarCriacao() {
        const camposValidos = validarCampos();
        if (camposValidos) {
            let response;
            try {
                response = await servicoVerificarCpfExistente(dados.cpf);
                if (response) confirmarOperacao("salvar");
            } catch (error) {
                if (error.response.data.erro)
                    mostrarToast(referenciaToast, error.response.data.erro, "erro");
            }
        }
    }
    function confirmarOperacao(operacao) {
        setConfirmacaoUsuario({ ...dados, operacao });
        setMostrarModalConfirmacao(true);
    };
    function ComandosConfirmacao() {
        if (!usuarioLogado?.perfil) {
            return <Button className={estilizarBotao(dados.cor_tema)} label="Salvar"
                onClick={validarConfirmarCriacao} />;
        } else {
            return (
                <div className={estilizarDivBotoesAcao()}>
                    <Button className={estilizarBotao(dados.cor_tema)} label="Alterar"
                        onClick={() => validarConfirmarAlteracao()} />
                    <Button className={estilizarBotaoRemover(dados.cor_tema)} label="Remover"
                        onClick={() => confirmarOperacao("remover")} />
                </div>
            );
        }
    };
    function alinharCentro() { if (!usuarioLogado?.cadastrado) return "center"; };
    return (
        <div className={estilizarFlex(alinharCentro())}>
            <Toast ref={referenciaToast} position="bottom-center" />
            <Dialog visible={mostrarModalConfirmacao} className={estilizarDialog()}
                header="Confirme seus dados" onHide={limparOcultar} closable={false}
                footer={<div className={estilizarFooterDialog()}></div>}>
                <ModalConfirmacaoUsuario />
            </Dialog>
            <Card title={tituloFormulario()} className={estilizarCard(dados.cor_tema)}>
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(dados.cor_tema)}>Tipo de Perfil*:</label>
                    <Dropdown name="perfil" className={estilizarDropdown(erros.perfil, dados.cor_tema)}
                        value={dados.perfil} options={opcoesPerfis} onChange={alterarEstado}
                        placeholder="-- Selecione --" disabled={usuarioLogado?.perfil} />
                    <MostrarMensagemErro mensagem={erros.perfil} />
                </div>
                <Divider className={estilizarDivider(dados.cor_tema)} />
                <h2 className={estilizarSubtitulo(dados.cor_tema)}>Dados Pessoais</h2>
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(dados.cor_tema)}>CPF*:</label>
                    <InputMask name="cpf" autoClear className={estilizarInputMask(erros.cpf, dados.cor_tema)}
                        mask={CPF_MASCARA} size={TAMANHOS.CPF} value={dados.cpf}
                        onChange={alterarEstado} disabled={usuarioLogado?.perfil} />
                    <MostrarMensagemErro mensagem={erros.cpf} />
                </div>
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(dados.cor_tema)}>Nome Completo*:</label>
                    <InputText name="nome" className={estilizarInputText(erros.nome, 400, dados.cor_tema)}
                        value={dados.nome} onChange={alterarEstado} disabled={usuarioLogado?.perfil} />
                    <MostrarMensagemErro mensagem={erros.nome} />
                </div>
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(dados.cor_tema)}>Email*:</label>
                    <InputText name="email" className={estilizarInputText(erros.email, 400, dados.cor_tema)}
                        value={dados.email} onChange={alterarEstado} />
                    <MostrarMensagemErro mensagem={erros.email} />
                </div>
                <Divider className={estilizarDivider(dados.cor_tema)} />
                <h2 className={estilizarSubtitulo(dados.cor_tema)}>Dados de Login</h2>
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(dados.cor_tema)}>Senha e Confirmacao*:</label>
                    <Password name="senha"
                        inputClassName={estilizarPasswordTextInputBorder(erros.senha, dados.cor_tema)}
                        className={estilizarPasswordInput(erros.senha)} toggleMask value={dados.senha}

                        onChange={alterarEstado} size={TAMANHOS.SENHA}

                        tooltip={usuarioLogado?.token

                            && "Sera alterada somente se a senha e a confirmacao forem informadas."} />
                    <Password name="confirmacao" className={estilizarPasswordInput(dados.cor_tema)} toggleMask
                        inputClassName={estilizarPasswordTextInputBorder(erros.senha || erros.confirmacao_senha,

                            dados.cor_tema)}

                        size={TAMANHOS.SENHA} feedback={false} value={dados.confirmacao}

                        onChange={alterarEstado} />
                    <MostrarMensagemErro mensagem={erros.senha || erros.confirmacao_senha} />
                </div>
                <Divider className={estilizarDivider(dados.cor_tema)} />
                <h2 className={estilizarSubtitulo(dados.cor_tema)}>Recuperação da conta</h2>
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(dados.cor_tema)}>Questão de Segurança*:</label>
                    <InputText name="questao"
                        className={estilizarInputText(erros.questao, 400, dados.cor_tema)}
                        placeholder="Ex: Qual era o nome do meu primeiro pet?" value={dados.questao}
                        onChange={alterarEstado} tooltipOptions={{ position: 'top' }}
                        tooltip={usuarioLogado?.token

                            && "Se a resposta nao for informada: a alteracao de questao sera ignorada."} />
                    <MostrarMensagemErro mensagem={erros.questao} />
                </div>
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(dados.cor_tema)}>Resposta*:</label>
                    <InputText name="resposta"
                        className={estilizarInputText(erros.resposta, 400, dados.cor_tema)}

                        value={dados.resposta} onChange={alterarEstado} />
                    <MostrarMensagemErro mensagem={erros.resposta} />
                </div>
                <Divider className={estilizarDivider(dados.cor_tema)} />
                <h2 className={estilizarSubtitulo(dados.cor_tema)}>Configurações*: </h2>
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(dados.cor_tema)}>Cor do Tema*:</label>
                    <Dropdown name="cor_tema" className={estilizarDropdown(erros.cor_tema, dados.cor_tema)}
                        value={dados.cor_tema} options={opcoesCores} onChange={alterarEstado}

                        placeholder="-- Selecione --" />
                    <MostrarMensagemErro mensagem={erros.cor_tema} />
                </div>
                <ComandosConfirmacao />
                <div className={estilizarFlex("center")}>
                    <Link to={linkRetorno()} className={estilizarLink(dados.cor_tema)}>{textoRetorno()}</Link>
                </div>
            </Card>
        </div>
    );
}