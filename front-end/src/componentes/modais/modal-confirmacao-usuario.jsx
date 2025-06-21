import { useContext, useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import mostrarToast from "../../utilitarios/mostrar-toast";
import ContextoUsuario from "../../contextos/contexto-usuario";
import { servicoAlterarUsuario, servicoRemoverUsuario } from "../../servicos/servicos-usuario";
import {
    estilizarBotao, estilizarBotaoRemover, estilizarDivCampo, estilizarInlineFlex,
    estilizarLabel, estilizarModal
} from "../../utilitarios/estilos";
export default function ModalConfirmacaoUsuario() {
    const referenciaToast = useRef(null);
    const { setUsuarioLogado, confirmacaoUsuario, setConfirmacaoUsuario, setMostrarModalConfirmacao, usuarioLogado, tokenRecuperacao}
        = useContext(ContextoUsuario);
    const dados = {
        cpf: confirmacaoUsuario?.cpf, perfil: confirmacaoUsuario?.perfil,
        nome: confirmacaoUsuario?.nome, senha: confirmacaoUsuario?.senha,
        email: confirmacaoUsuario?.email, questao: confirmacaoUsuario?.questao,
        resposta: confirmacaoUsuario?.resposta, cor_tema: confirmacaoUsuario?.cor_tema
    };
    const [redirecionar, setRedirecionar] = useState(false);
    const navegar = useNavigate();
    useEffect(() => {
        if (redirecionar) {
            const timeout = setTimeout(() => {
                navegar("/"); 
            }, 2500);
    
            return () => clearTimeout(timeout); 
        }
    }, [redirecionar, navegar]);

    function labelOperacao() {
        switch (confirmacaoUsuario?.operacao) {
            case "salvar": return "Salvar";
            case "alterar": return "Alterar";
            case "remover": return "Remover";
            default: return;
        }
    };
    function exibirPerfilFormatado() {
        switch (dados.perfil) {
            case "produtor": return "Produtor";
            case "patrocinador": return "Patrocinador";
            default: return "";
        }
    };
    function fecharToast() {
        if (redirecionar) {
            setMostrarModalConfirmacao(false);
            setConfirmacaoUsuario({});
            if (confirmacaoUsuario?.operacao) setUsuarioLogado({}); // inseriu ?
            navegar("../pagina-inicial");
        }
    };
    function finalizarCadastro() {
        if (dados.perfil === "produtor") {
            setUsuarioLogado({ ...dados, cadastrado: false });
            setMostrarModalConfirmacao(false);
            navegar("../cadastrar-produtor");
        } else if (dados.perfil === "patrocinador") {
            setUsuarioLogado({ ...dados, cadastrado: false });
            setMostrarModalConfirmacao(false);
            navegar("../cadastrar-patrocinador");
        }
    };
    async function alterarUsuario(dadosAlterados) {
        try {
            const response = await servicoAlterarUsuario({ ...dadosAlterados, cpf: usuarioLogado.cpf });
    
            if (response && response.data) {
                setUsuarioLogado({ ...usuarioLogado, ...response.data });
                setRedirecionar(true);
                mostrarToast(referenciaToast, "Alterado com sucesso! Redirecionando à Página Inicial...", "sucesso");
            } else {
                throw new Error("Resposta inválida do servidor");
            }
        } catch (error) {
            const mensagemErro = error.response?.data?.erro || "Erro inesperado ao alterar usuário.";
            mostrarToast(referenciaToast, mensagemErro, "erro");
        }
    };    
    async function removerUsuario() {
        try {
            await servicoRemoverUsuario(usuarioLogado.cpf);
            setRedirecionar(true);
            mostrarToast(referenciaToast, "Removido com sucesso! Redirecionando ao Login.", "sucesso");
        } catch (error) { mostrarToast(referenciaToast, error.response.data.erro, "erro"); }
    };
    function executarOperacao() {
        switch (confirmacaoUsuario.operacao) {
            case "salvar":
                finalizarCadastro();
                break;
            case "alterar":
                alterarUsuario({
                    email: dados.email, senha: dados.senha, questao: dados.questao,
                    resposta: dados.resposta, cor_tema: dados.cor_tema
                });
                break;
            case "remover":
                removerUsuario();
                break;
            default: break;
        }
    };
    function ocultar() {
        if (!redirecionar) {
            setConfirmacaoUsuario({});
            setMostrarModalConfirmacao(false);
        }
    };
    return (
        <div className={estilizarModal()}>
            <Toast ref={referenciaToast} onHide={fecharToast} position="bottom-center" />
            <div className={estilizarDivCampo()}>
                <label className={estilizarLabel(confirmacaoUsuario?.cor_tema)}>Tipo de Perfil:</label>
                <label>{exibirPerfilFormatado()}</label>
            </div>
            <div className={estilizarDivCampo()}>
                <label className={estilizarLabel(confirmacaoUsuario?.cor_tema)}>
                    CPF -- nome de usuario:</label>
                <label>{dados.cpf}</label>
            </div>
            <div className={estilizarDivCampo()}>
                <label className={estilizarLabel(confirmacaoUsuario?.cor_tema)}>Nome Completo:</label>
                <label>{dados.nome}</label>
            </div>
            <div className={estilizarDivCampo()}>
                <label className={estilizarLabel(confirmacaoUsuario?.cor_tema)}>Email:</label>
                <label>{dados.email}</label>
            </div>
            <div className={estilizarDivCampo()}>
                <label className={estilizarLabel(confirmacaoUsuario?.cor_tema)}>
                    Questao de Seguranca:</label>
                <label>{dados.questao}</label>
            </div>
            <div className={estilizarDivCampo()}>
                <label className={estilizarLabel(confirmacaoUsuario?.cor_tema)}>Resposta:</label>
                <label>{dados.resposta}</label>
            </div>
            <div className={estilizarInlineFlex()}>
                <Button label={labelOperacao()} onClick={executarOperacao}
                    className={estilizarBotao(confirmacaoUsuario?.cor_tema)} />
                <Button label="Corrigir" onClick={ocultar}
                    className={estilizarBotaoRemover(confirmacaoUsuario?.cor_tema)} />
            </div>
        </div>
    );
};