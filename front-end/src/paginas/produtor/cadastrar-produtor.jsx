import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { Toast } from "primereact/toast";
import ContextoUsuario from "../../contextos/contexto-usuario";
import { servicoCadastrarProdutor, servicoBuscarProdutor, servicoAtualizarProdutor }
    from "../../servicos/servicos-produtor";
import mostrarToast from "../../utilitarios/mostrar-toast";
import { MostrarMensagemErro, checarListaVazia, validarCamposObrigatorios }
    from "../../utilitarios/validacoes";
import {
    estilizarBotao, estilizarBotaoRetornar, estilizarCard, estilizarDivCampo, estilizarDivider,
    estilizarDropdown, estilizarFlex, estilizarInlineFlex, estilizarInputNumber, estilizarLabel
}
    from "../../utilitarios/estilos";
export default function CadastrarProdutor() {
    const referenciaToast = useRef(null);
    const { usuarioLogado, setUsuarioLogado } = useContext(ContextoUsuario);
    const [dados, setDados] = useState({ atuacao: "", anos_experiencia: "" });
    const [erros, setErros] = useState({});
    const [cpfExistente, setCpfExistente] = useState(false);
    const navegar = useNavigate();
    const opcoesAtuacao = [{ label: "Tecnico", value: "tecnico" },
    { label: "Criativo", value: "criativo" }];
    function alterarEstado(event) {
        const chave = event.target.name || event.value;
        const valor = event.target.value;
        setDados({ ...dados, [chave]: valor });
    };
    function validarCampos() {
        let errosCamposObrigatorios;
        errosCamposObrigatorios = validarCamposObrigatorios(dados);
        setErros(errosCamposObrigatorios);
        return checarListaVazia(errosCamposObrigatorios);
    };
    function tituloFormulario() {
        if (usuarioLogado?.cadastrado) return "Alterar Produtor";
        else return "Alterar Produtor";
    };
    async function atualizarProdutor() {
        if (validarCampos()) {
            try {
                const response = await servicoAtualizarProdutor({ ...dados, cpf: usuarioLogado.cpf });
                if (response) mostrarToast(referenciaToast, "Produtor atualizado com sucesso!", "sucesso");
            } catch (error) { mostrarToast(referenciaToast, error.response.data.erro, "erro"); }
        }
    };
    async function cadastrarProdutor() {
        if (validarCampos()) {
            try {
                const response = await servicoCadastrarProdutor({
                    ...dados, usuario_info: usuarioLogado,
                    atuacao: dados.atuacao,
                    anos_experiencia: dados.anos_experiencia
                });
                if (response.data)
                    setUsuarioLogado(usuario => ({
                        ...usuario, status: response.data.status,
                        token: response.data.token
                    }));
                mostrarToast(referenciaToast, "Produtor cadastrado com sucesso!", "sucesso");
            } catch (error) {
                setCpfExistente(true);
                mostrarToast(referenciaToast, error.response.data.erro, "erro");
            }
        }
    };
    function labelBotaoSalvar() {
        if (usuarioLogado?.cadastrado) return "Alterar";
        else return "Cadastrar";
    };
    function acaoBotaoSalvar() {
        if (usuarioLogado?.cadastrado) atualizarProdutor();
        else cadastrarProdutor();
    };
    function redirecionar() {
        if (cpfExistente) {
            setUsuarioLogado(null);
            navegar("/criar-usuario");
        } else {
            setUsuarioLogado(usuarioLogado => ({ ...usuarioLogado, cadastrado: true }));
            navegar("/pagina-inicial");
        }
    };
    useEffect(() => {
        let desmontado = false;
        async function buscarDadosProdutor() {
            try {
                const response = await servicoBuscarProdutor(usuarioLogado.cpf);
                if (!desmontado && response.data) {
                    setDados(dados => ({
                        ...dados, atuacao: response.data.atuacao,
                        anos_experiencia: response.data.anos_experiencia
                    }));
                }
            } catch (error) {
                const erro = error.response.data.erro;
                if (erro) mostrarToast(referenciaToast, erro, "erro");
            }
        }
        if (usuarioLogado?.cadastrado) buscarDadosProdutor();
        return () => desmontado = true;
    }, [usuarioLogado?.cadastrado, usuarioLogado.cpf]);
    return (
        <div className={estilizarFlex()}>
            <Toast ref={referenciaToast} onHide={redirecionar} position="bottom-center" />
            <Card title={tituloFormulario()} className={estilizarCard(usuarioLogado.cor_tema)}>
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuarioLogado.cor_tema)}>Atuação*:</label>
                    <Dropdown name="atuacao"
                        className={estilizarDropdown(erros.atuacao, usuarioLogado.cor_tema)}
                        value={dados.atuacao} options={opcoesAtuacao} onChange={alterarEstado}

                        placeholder="-- Selecione --" />
                    <MostrarMensagemErro mensagem={erros.atuacao} />
                </div>
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuarioLogado.cor_tema)}>
                        Anos de Experiência*:</label>
                    <InputNumber name="anos_experiencia" size={5}
                        value={dados.anos_experiencia}
                        onValueChange={alterarEstado} mode="decimal"
                        inputClassName={estilizarInputNumber(erros.anos_experiencia,

                            usuarioLogado.cor_tema)} />
                    <MostrarMensagemErro mensagem={erros.anos_experiencia} />
                </div>
                <Divider className={estilizarDivider(dados.cor_tema)} />
                <div className={estilizarInlineFlex()}>
                    <Button className={estilizarBotaoRetornar()} label="Retornar" onClick={redirecionar} />
                    <Button className={estilizarBotao()} label={labelBotaoSalvar()} onClick={acaoBotaoSalvar} />
                </div>
            </Card>
        </div>
    );
};