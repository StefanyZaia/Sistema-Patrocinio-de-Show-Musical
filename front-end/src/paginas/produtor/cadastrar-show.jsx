import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Checkbox } from "primereact/checkbox";
import { InputTextarea } from "primereact/inputtextarea";
import { Toast } from "primereact/toast";
import ContextoUsuario from "../../contextos/contexto-usuario";
import ContextoProdutor from "../../contextos/contexto-produtor";
import {
    servicoAlterarShow, servicoCadastrarShow, servicoRemoverShow,
    servicoBuscarLocalizacaoShows
} from "../../servicos/servicos-produtor";
import mostrarToast from "../../utilitarios/mostrar-toast";
import { MostrarMensagemErro, checarListaVazia, validarCamposObrigatorios }
    from "../../utilitarios/validacoes";
import {
    estilizarBotao, estilizarBotaoRemover, estilizarBotaoRetornar, estilizarCard, estilizarCheckbox,
    estilizarDivCampo, estilizarDivider, estilizarDropdown, estilizarFlex,
    estilizarInlineFlex, estilizarInputText, estilizarInputTextarea, estilizarLabel
}
    from "../../utilitarios/estilos";
export default function CadastrarShow() {
    const referenciaToast = useRef(null);
    const { usuarioLogado } = useContext(ContextoUsuario);
    const { showConsultado } = useContext(ContextoProdutor);
    const [dados, setDados] = useState({
        nome_show: showConsultado?.nome_show || "",
        genero_musical: showConsultado?.genero_musical || "",
        localizacao: showConsultado?.localizacao || "",
        data_show: showConsultado?.data_show || "",
        descricao: showConsultado?.descricao || "",
        show_gratuito: showConsultado?.show_gratuito || "",
        categoria: showConsultado?.categoria || ""
    });
    const [listaLocalizacao, setListaLocalizacao] = useState([]);
    const [erros, setErros] = useState({});
    const navegar = useNavigate();
    const opcoesGeneroMusical = [{ label: "PostHardcore", value: "PostHardcore" },
    { label: "Metalcore", value: "Metalcore" },
    { label: "PopPunk", value: "PopPunk" }];
    const opcoesResultado = [{ label: "Festival", value: "festival" },
    { label: "Solo", value: "solo" },
    { label: "Beneficente", value: "beneficente" }];
    function alterarEstado(event) {
        const chave = event.target.name || event.value;
        let valor = event.target.value || event.checked;
        setDados({ ...dados, [chave]: valor });
    };
    function validarCampos() {
        const { nome_show, genero_musical, localizacao, data_show, descricao } = dados;
        let errosCamposObrigatorios = validarCamposObrigatorios({
            nome_show, genero_musical, localizacao,
            data_show, descricao
        });
        setErros(errosCamposObrigatorios);
        return checarListaVazia(errosCamposObrigatorios);
    };
    function retornarAdministrarShows() { navegar("../administrar-shows"); };
    async function cadastrarShow() {
        if (validarCampos()) {
            try {
                await servicoCadastrarShow({ ...dados, cpf: usuarioLogado.cpf });
                mostrarToast(referenciaToast, "Show cadastrado com sucesso!", "sucesso");
            } catch (error) {
                const mensagemErro = error.response?.data?.erro || "Erro inesperado ao cadastrar o show.";
                mostrarToast(referenciaToast, mensagemErro, "error");
            }

        }
    };
    async function alterarShow() {
        if (validarCampos()) {
            try {
                await servicoAlterarShow({ ...dados, id: showConsultado.id });
                mostrarToast(referenciaToast, "Show alterado com sucesso!", "sucesso");
            } catch (error) { mostrarToast(referenciaToast, error.response.data.erro, "error"); }
        }
    };
    async function removerShow() {
        try {
            await servicoRemoverShow(showConsultado.id);
            mostrarToast(referenciaToast, "Show excluido com sucesso!", "sucesso");
        } catch (error) { mostrarToast(referenciaToast, error.response.data.erro, "error"); }
    };
    function mostrarPrioridades() { navegar("../pesquisar-prioridades"); };
    function BotoesAcoes() {
        if (showConsultado) {
            return (
                <div className={estilizarInlineFlex()}>
                    <Button className={estilizarBotaoRetornar()} label="Retornar"
                        onClick={retornarAdministrarShows} />
                    <Button className={estilizarBotaoRemover()} label="Remover" onClick={removerShow} />
                    <Button className={estilizarBotao()} label="Alterar" onClick={alterarShow} />
                    <Button className={estilizarBotao()} label="Prioridades" onClick={mostrarPrioridades}/>
                </div>
            );
        } else {
            return (
                <div className={estilizarInlineFlex()}>
                    <Button className={estilizarBotaoRetornar()} label="Retornar"
                        onClick={retornarAdministrarShows} />
                    <Button className={estilizarBotao()} label="Cadastrar" onClick={cadastrarShow} />
                </div>
            );
        }
    };
    function nome_showFormulario() {
        if (showConsultado) return "Alterar Show";
        else return "Cadastrar Show";
    };
    useEffect(() => {
        async function buscarLocalizacaoShows() {
            try {
                const response = await servicoBuscarLocalizacaoShows();
                if (response.data) setListaLocalizacao(response.data);
            } catch (error) {
                const erro = error.response.data.erro;
                if (erro) mostrarToast(referenciaToast, erro, "error");
            }
        }
        buscarLocalizacaoShows();
    }, [])
    return (
        <div className={estilizarFlex()}>
            <Toast ref={referenciaToast} onHide={retornarAdministrarShows} position="bottom-center" />
            <Card title={nome_showFormulario()} className={estilizarCard(usuarioLogado.cor_tema)}>
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuarioLogado.cor_tema)}>Nome do Show*:</label>
                    <InputText name="nome_show"
                        className={estilizarInputText(erros.nome_show, 400, usuarioLogado.cor_tema)}

                        value={dados.nome_show} onChange={alterarEstado} />
                    <MostrarMensagemErro mensagem={erros.nome_show} />
                </div>
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuarioLogado.cor_tema)}>Gênero Musical*:</label>
                    <Dropdown name="genero_musical"
                        className={estilizarDropdown(erros.genero_musical, usuarioLogado.cor_tema)}
                        value={dados.genero_musical} options={opcoesGeneroMusical} onChange={alterarEstado}

                        placeholder="-- Selecione --" />
                    <MostrarMensagemErro mensagem={erros.genero_musical} />
                </div>
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuarioLogado.cor_tema)}>
                        Localizações Cadastradas:</label>
                    <Dropdown name="localizacao" placeholder="-- Selecione --" showClear
                        className={estilizarDropdown(erros.localizacao, usuarioLogado.cor_tema)} filter
                        options={listaLocalizacao} onChange={alterarEstado}
                        emptyMessage={"Nenhuma localização cadastrada."} />
                </div>
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuarioLogado.cor_tema)}>Localização*:</label>
                    <InputText name="localizacao"
                        className={estilizarInputText(erros.localizacao, 200, usuarioLogado.cor_tema)}

                        value={dados.localizacao} onChange={alterarEstado} />
                    <MostrarMensagemErro mensagem={erros.localizacao} />
                </div>
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuarioLogado.cor_tema)}>Data do Show*:</label>
                    <InputText name="data_show" type="date" value={dados.data_show}
                        className={estilizarInputText(erros.data_show, usuarioLogado.cor_tema)}
                        onChange={alterarEstado} />
                    <MostrarMensagemErro mensagem={erros.data_show} />
                </div>
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuarioLogado.cor_tema)}>Descrição*:</label>
                    <InputTextarea name="descricao" value={dados.descricao}
                        className={estilizarInputTextarea(erros.descricao, usuarioLogado.cor_tema)}
                        onChange={alterarEstado} autoResize cols={40} />
                    <MostrarMensagemErro mensagem={erros.descricao} />
                </div>
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuarioLogado.cor_tema)}>Show Gratuito:</label>
                    <Checkbox inputId="checkbox_show_gratuito" name="show_gratuito"
                        checked={dados.show_gratuito === true}
                        onChange={(e) => setDados({ ...dados, show_gratuito: e.checked })}
                        className={estilizarCheckbox()} />
                    <label htmlFor="checkbox_show_gratuito" style={{ marginLeft: "8px" }}>Sim</label>
                </div>
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuarioLogado.cor_tema)}>Categoria*:</label>
                    <Dropdown name="categoria"
                        className={estilizarDropdown(erros.categoria, usuarioLogado.cor_tema)}
                        value={dados.categoria} options={opcoesResultado} onChange={alterarEstado}

                        placeholder="-- Selecione --" />
                    <MostrarMensagemErro mensagem={erros.categoria} />
                </div>
                <Divider className={estilizarDivider()} />
                <BotoesAcoes />
            </Card>
        </div>
    );
}