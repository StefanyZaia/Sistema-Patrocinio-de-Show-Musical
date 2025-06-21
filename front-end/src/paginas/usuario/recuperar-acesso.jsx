import { useContext, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Dialog } from "primereact/dialog";
import { InputMask } from "primereact/inputmask";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import ContextoUsuario from "../../contextos/contexto-usuario";
import ModalRecuperarAcesso from "../../componentes/modais/modal-recuperar-acesso";
import mostrarToast from "../../utilitarios/mostrar-toast";
import { CPF_MASCARA } from "../../utilitarios/mascaras";
import { servicoBuscarQuestaoSeguranca, servicoVerificarRespostaCorreta }
    from "../../servicos/servicos-usuario";
import { MostrarMensagemErro, checarListaVazia, validarCamposObrigatorios, validarCpf }
    from "../../utilitarios/validacoes";
import {
    TAMANHOS, estilizarBotao, estilizarCard, estilizarDialog, estilizarDivCampo, estilizarFlex,
    estilizarFooterDialog, estilizarInputMask, estilizarInputText, estilizarLabel, estilizarLink,
    estilizarParagrafo
} from "../../utilitarios/estilos";
export default function RecuperarAcesso() {
    const referenciaToast = useRef(null);
    const { setCpfVerificado, setNovaSenha, setTokenRecuperacao } = useContext(ContextoUsuario);
    const [dados, setDados] = useState({ cpf: "", questao: "", resposta: "", token: "" });
    const [mostrarModal, setMostrarModal] = useState(false);
    const [desabilitar, setDesabilitar] = useState(true);
    const [timer, setTimer] = useState(null);
    const [erros, setErros] = useState({});
    function alterarEstado(event) {
        const chave = event.target.name || event.value;
        const valor = event.target.value;
        setDados({ ...dados, [chave]: valor });
    };
    function validarCampos() {
        let errosCamposObrigatorios = validarCamposObrigatorios({ resposta: dados.resposta });
        setErros(errosCamposObrigatorios);
        return checarListaVazia(errosCamposObrigatorios);
    };
    function esconderModal() {
        setNovaSenha({});
        setMostrarModal(false);
    };
    async function buscarQuestaoSeguranca(event) {
        const cpf = event.target.value;
        setDados({ ...dados, cpf });
        clearTimeout(timer);
        const novoTimer = setTimeout(async () => {
            try {
                if (validarCpf(event.target.value)) {
                    const response = await servicoBuscarQuestaoSeguranca(cpf);
                    setDesabilitar(false);
                    setDados({ ...dados, cpf, questao: response.data.questao });
                }
            } catch (error) {
                mostrarToast(referenciaToast, error.response.data.mensagem, "erro");
                setDados({ ...dados, questao: "" });
            }
        }, 1500);
        setTimer(novoTimer);
    };
    async function verificarRespostaCorreta() {
        try {
            const cpf = dados.cpf;
            const response = await servicoVerificarRespostaCorreta({ cpf, resposta: dados.resposta });
            setCpfVerificado(cpf);
            setTokenRecuperacao(response.data.token);
            setMostrarModal(true);
        } catch (error) {
            console.error("Erro ao verificar resposta:", error);
            const mensagem = error.response?.data?.mensagem || "Erro inesperado ao verificar resposta.";
            mostrarToast(referenciaToast, mensagem, "erro");
         }
    };
    async function validarConfirmarRecuperacaoAcesso() {
        if (validarCampos()) { await verificarRespostaCorreta(); }
    };
    return (
        <div className={estilizarFlex("center")}>
            <Toast ref={referenciaToast} position="bottom-center" />
            <Dialog visible={mostrarModal} className={estilizarDialog()}
                header="Digite sua nova senha e confirme" onHide={esconderModal}
                footer={<div className={estilizarFooterDialog()}></div>}>
                <ModalRecuperarAcesso />
            </Dialog>
            <Card title="Recuperar Acesso de Usuario" className={estilizarCard()}>
                <p className={estilizarParagrafo()}>
                    {`Para recuperar o acesso à sua conta, forneça as informações abaixo:`}</p>
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel()}>CPF*:</label>
                    <InputMask name="cpf" className={estilizarInputMask(erros.cpf)} size={TAMANHOS.CPF}
                        mask={CPF_MASCARA} autoClear value={dados.cpf} onChange={buscarQuestaoSeguranca} />
                </div>
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel()}>Questao de seguranca*:</label>
                    <InputText name="questao" className={estilizarInputText(erros.questao, 400)}
                        value={dados.questao} disabled />
                </div>
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel()}>Resposta*:</label>
                    <InputText name="resposta" className={estilizarInputText(erros.resposta, 350)}
                        disabled={desabilitar} value={dados.resposta} onChange={alterarEstado} />
                    <MostrarMensagemErro mensagem={erros.resposta} />
                </div>
                <div className={estilizarFlex()}>
                    <Button className={estilizarBotao()} label="Confirmar" disabled={desabilitar}
                        onClick={validarConfirmarRecuperacaoAcesso} />
                    <Link to="/" className={estilizarLink()}>Voltar ao Login</Link>
                </div>
            </Card>
        </div>
    );
}