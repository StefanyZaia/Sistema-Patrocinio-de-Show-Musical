import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import { Dropdown } from "primereact/dropdown";
import { InputMask } from "primereact/inputmask";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import ContextoUsuario from "../../contextos/contexto-usuario";
import { ANO_MASCARA, TELEFONE_MASCARA } from "../../utilitarios/mascaras";
import { servicoCadastrarPatrocinador, servicoAtualizarPatrocinador, servicoBuscarPatrocinador }
    from "../../servicos/servicos-patrocinador";
import mostrarToast from "../../utilitarios/mostrar-toast";
import { MostrarMensagemErro, checarListaVazia, validarCamposObrigatorios }
    from "../../utilitarios/validacoes";
import {
    TAMANHOS, estilizarBotao, estilizarBotaoRetornar, estilizarCard, estilizarDivCampo,
    estilizarDivider, estilizarDropdown, estilizarFlex, estilizarInlineFlex, estilizarInputMask,
    estilizarInputText, estilizarLabel
} from "../../utilitarios/estilos";
export default function CadastrarPatrocinador() {
    const referenciaToast = useRef(null);
    const { usuarioLogado, setUsuarioLogado } = useContext(ContextoUsuario);
    const [dados, setDados] = useState({
        tipo: "", ano_inicio_patrocinio: "", data_inicio_empresa: "",
        telefone: ""
    });
    const [erros, setErros] = useState({});
    const [cpfExistente, setCpfExistente] = useState(false);
    const navegar = useNavigate();
    const opcoesTipo = [{ label: "Financeiro", value: "Financeiro" },
    { label: "Produtos", value: "Produtos" }];
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
        if (usuarioLogado?.cadastrado) return "Alterar Patrocinador";
        else return "Cadastrar Patrocinador";
    };
    async function cadastrarPatrocinador() {
        if (validarCampos()) {
            try {
                const response = await servicoCadastrarPatrocinador({
                    ...dados, usuario_info: usuarioLogado,
                    tipo: dados.tipo, ano_inicio_patrocinio: dados.ano_inicio_patrocinio,
                    data_inicio_empresa: dados.data_inicio_empresa, telefone: dados.telefone
                });
                if (response.data)
                    setUsuarioLogado(usuario => ({
                        ...usuario, status: response.data.status,
                        token: response.data.token
                    }));
                mostrarToast(referenciaToast, "Patrocinador cadastrado com sucesso!", "sucesso");
            } catch (error) {
                setCpfExistente(true);
                mostrarToast(referenciaToast, error.response.data.erro, "erro");
            }
        }
    };
    async function atualizarPatrocinador() {
        if (validarCampos()) {
            try {
                const response = await servicoAtualizarPatrocinador({ ...dados, cpf: usuarioLogado.cpf });
                if (response) mostrarToast(referenciaToast, "Patrocinador atualizado com sucesso!", "sucesso");
            } catch (error) { mostrarToast(referenciaToast, error.response.data.erro, "erro"); }
        }
    };
    function labelBotaoSalvar() {
        if (usuarioLogado?.cadastrado) return "Alterar";
        else return "Cadastrar";
    };
    function acaoBotaoSalvar() {
        if (usuarioLogado?.cadastrado) atualizarPatrocinador();
        else cadastrarPatrocinador();
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
        async function buscarDadosPatrocinador() {
            try {
                const response = await servicoBuscarPatrocinador(usuarioLogado.cpf);
                if (!desmontado && response.data) {
                    setDados(dados => ({
                        ...dados, tipo: response.data.tipo,
                        ano_inicio_patrocinio: response.data.ano_inicio_patrocinio,

                        data_inicio_empresa: response.data.data_inicio_empresa, telefone: response.data.telefone
                    }));
                }
            } catch (error) {
                const erro = error.response.data.erro;
                if (erro) mostrarToast(referenciaToast, erro, "erro");
            }
        }
        if (usuarioLogado?.cadastrado) buscarDadosPatrocinador();
        return () => desmontado = true;
    }, [usuarioLogado?.cadastrado, usuarioLogado.cpf]);
    return (
        <div className={estilizarFlex()}>
            <Toast ref={referenciaToast} onHide={redirecionar} position="bottom-center" />
            <Card title={tituloFormulario()} className={estilizarCard(usuarioLogado.cor_tema)}>
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuarioLogado.cor_tema)}>Tipo*:</label>
                    <Dropdown name="tipo" className={estilizarDropdown(erros.tipo, usuarioLogado.cor_tema)}
                        value={dados.tipo} options={opcoesTipo} onChange={alterarEstado}

                        placeholder="-- Selecione --" />
                    <MostrarMensagemErro mensagem={erros.tipo} />
                </div>
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuarioLogado.cor_tema)}>Ano do Inicio do Patrocinio*:</label>
                    <InputMask name="ano_inicio_patrocinio" autoClear size={TAMANHOS.ANO} onChange={alterarEstado}
                        className={estilizarInputMask(erros.ano_inicio_patrocinio, usuarioLogado.cor_tema)}
                        mask={ANO_MASCARA} value={dados.ano_inicio_patrocinio} />
                    <MostrarMensagemErro mensagem={erros.ano_inicio_patrocinio} />
                </div>
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuarioLogado.cor_tema)}>Data de Inicio da Empresa*:</label>
                    <InputText name="data_inicio_empresa" type="date" value={dados.data_inicio_empresa}
                        className={estilizarInputText(erros.data_inicio_empresa, usuarioLogado.cor_tema)}
                        onChange={alterarEstado} />
                    <MostrarMensagemErro mensagem={erros.data_inicio_empresa} />
                </div>
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuarioLogado.cor_tema)}>Telefone*:</label>
                    <InputMask name="telefone" autoClear size={TAMANHOS.TELEFONE} onChange={alterarEstado}
                        className={estilizarInputMask(erros.telefone, usuarioLogado.cor_tema)}
                        mask={TELEFONE_MASCARA} value={dados.telefone} />
                    <MostrarMensagemErro mensagem={erros.telefone} />
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