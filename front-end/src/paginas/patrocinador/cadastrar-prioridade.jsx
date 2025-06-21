import { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Checkbox } from "primereact/checkbox";
import { Divider } from "primereact/divider";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Toast } from "primereact/toast";
import ContextoUsuario from "../../contextos/contexto-usuario";
import  ContextoPatrocinador from "../../contextos/contexto-patrocinador";
import { servicoCadastrarPrioridade, servicoRemoverPrioridade } from "../../servicos/servicos-patrocinador";
import mostrarToast from "../../utilitarios/mostrar-toast";
import { MostrarMensagemErro, checarListaVazia, validarCamposObrigatorios }
    from "../../utilitarios/validacoes";
import {
    estilizarBotao, estilizarBotaoRetornar, estilizarBotaoRemover, estilizarCard,
    estilizarCheckbox, estilizarDivCampo, estilizarDivider, estilizarFlex, estilizarInlineFlex,
    estilizarInputText, estilizarInputTextarea, estilizarLabel
} from "../../utilitarios/estilos";
export default function CadastrarPrioridade() {
    const referenciaToast = useRef(null);
    const { usuarioLogado } = useContext(ContextoUsuario);

    const {
        prioridadeConsultada,
        showSelecionado,
        setShowPrioridade,
        setShowConsultado
    } = useContext(ContextoPatrocinador);
    const [dados, setDados] = useState({
        id_show: showSelecionado?.id || "",
        nivel_prioridade: prioridadeConsultada?.nivel_prioridade || "",
        justificativa: prioridadeConsultada?.justificativa || ""
    });
    const [erros, setErros] = useState({});
    const navegar = useNavigate();
    function alterarEstado(event) {
        const chave = event.target.name;
        let valor = event.target.value;

        if (event.target.type === "number") {
            valor = valor === "" ? "" : Number(valor);
        }

        if (event.target.type === "checkbox") {
            valor = event.target.checked;
        }

        setDados({ ...dados, [chave]: valor });
    };
    function validarCampos() {
        const { justificativa, nivel_prioridade } = dados;
        let errosCamposObrigatorios = validarCamposObrigatorios({ justificativa });

        if (!nivel_prioridade || nivel_prioridade < 1 || nivel_prioridade > 5) {
            errosCamposObrigatorios.nivel_prioridade = "Nível de prioridade deve estar entre 1 e 5";
        }

        setErros(errosCamposObrigatorios);
        return checarListaVazia(errosCamposObrigatorios);
    };
    function showLabel() {
        if (prioridadeConsultada?.nome_show || showSelecionado)
            return "Show Selecionado*:";
        else return "Selecione um Show*:";
    };
    function pesquisarShows() { navegar("../pesquisar-shows"); };
    function retornarAdministrarPrioridades() { navegar("../administrar-prioridades"); };
    async function cadastrarPrioridade() {
        if (validarCampos()) {
            try {
                console.log("Prioridade sendo enviada:", { ...dados, cpf: usuarioLogado.cpf });
                await servicoCadastrarPrioridade({ ...dados, cpf: usuarioLogado.cpf });
                mostrarToast(referenciaToast, "Prioridade cadastrada com sucesso!", "sucesso");
            } catch (error) { mostrarToast(referenciaToast, error.response.data.erro, "erro"); }
        }
    };
    async function removerPrioridade() {
        try {
            await servicoRemoverPrioridade(prioridadeConsultada.id);
            mostrarToast(referenciaToast, "Prioridade removida com sucesso!", "sucesso");
        } catch (error) { mostrarToast(referenciaToast, error.response.data.erro, "erro"); }
    };
    function consultarShowPrioridade() {
        setShowConsultado(null);
        setShowPrioridade(prioridadeConsultada?.show);
        navegar("../consultar-show");
    };
    function BotoesAcoes() {
        if (prioridadeConsultada) {
            return (
                <div className={estilizarInlineFlex()}>
                    <Button className={estilizarBotaoRetornar()} label="Retornar"
                        onClick={retornarAdministrarPrioridades} />
                    <Button className={estilizarBotaoRemover()} label="Remover" onClick={removerPrioridade} />
                    <Button className={estilizarBotao()} label="Show" onClick={consultarShowPrioridade} />
                </div>
            );
        } else {
            return (
                <div className={estilizarInlineFlex()}>
                    <Button className={estilizarBotaoRetornar()} label="Retornar"
                        onClick={retornarAdministrarPrioridades} />
                    <Button className={estilizarBotao()} label="Cadastrar" onClick={cadastrarPrioridade} />
                </div>
            );
        }
    };
    function tituloFormulario() {
        if (prioridadeConsultada) return "Remover Prioridade";
        else return "Cadastrar Prioridade";
    };
    function ShowInputText() {
        if (showSelecionado?.nome_show) {
            return <InputText name="nome_show"
                className={estilizarInputText(erros.nome_show, 400, usuarioLogado.cor_tema)}
                value={showSelecionado?.nome_show} disabled />
        } else if (prioridadeConsultada?.show?.nome_show) {
            return <InputText name="nome_show"
                className={estilizarInputText(erros.nome_show, 400, usuarioLogado.cor_tema)}
                value={prioridadeConsultada?.show?.nome_show} disabled />
        } else return null;
    };
    function BotaoSelecionar() {
        if (!showSelecionado && !prioridadeConsultada) {
            return <Button className={estilizarBotao()} label="Selecionar" onClick={pesquisarShows} />
        } else if (showSelecionado) {
            return <Button className={estilizarBotao()} label="Substituir" onClick={pesquisarShows} />;
        } else return null;
    };
    return (
        <div className={estilizarFlex()}>
            <Toast ref={referenciaToast} onHide={retornarAdministrarPrioridades} position="bottom-center" />
            <Card title={tituloFormulario()} className={estilizarCard(usuarioLogado.cor_tema)}>
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuarioLogado.cor_tema)}>{showLabel()}</label>
                    <BotaoSelecionar />
                    <ShowInputText />
                    <MostrarMensagemErro mensagem={erros.id} />
                </div>
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuarioLogado.cor_tema)}>Nível de Prioridade*:</label>
                    <input
                        type="number"
                        name="nivel_prioridade"
                        value={dados.nivel_prioridade}
                        onChange={(e) => alterarEstado(e)}
                        className={estilizarCheckbox()}
                        autoResize
                        min="1"
                        max="5"
                        step="1"
                    />
                </div>
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuarioLogado.cor_tema)}>Justificativa*:</label>
                    <InputTextarea name="justificativa" value={dados.justificativa}
                        className={estilizarInputTextarea(erros.descricao, usuarioLogado.cor_tema)}
                        onChange={alterarEstado} autoResize cols={40} />
                    <MostrarMensagemErro mensagem={erros.justificativa} />
                </div>
                <Divider className={estilizarDivider()} />
                <BotoesAcoes />
            </Card>
        </div>
    );
}