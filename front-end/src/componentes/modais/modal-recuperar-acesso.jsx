import { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Password } from "primereact/password";
import { Toast } from "primereact/toast";
import ContextoUsuario from "../../contextos/contexto-usuario";
import { servicoAlterarUsuario } from "../../servicos/servicos-usuario";
import mostrarToast from "../../utilitarios/mostrar-toast";
import { MostrarMensagemErro, checarListaVazia, validarCamposObrigatorios, validarConfirmacaoSenha }
    from "../../utilitarios/validacoes";
import {
    TAMANHOS, estilizarBotao, estilizarDivCampo, estilizarLabel, estilizarModal,
    estilizarPasswordInput, estilizarPasswordTextInputBorder
} from "../../utilitarios/estilos";
export default function ModalRecuperarAcesso() {
    const referenciaToast = useRef(null);
    const { cpfVerificado, setCpfVerificado, novaSenha, setNovaSenha, tokenRecuperacao,
        setTokenRecuperacao } = useContext(ContextoUsuario);
    const [dados, setDados] = useState({
        senha: novaSenha?.senha || "", confirmacao:
            novaSenha?.confirmacao || ""
    });
    const [erros, setErros] = useState({});
    const navegar = useNavigate();
    function validarCampos() {
        let errosCamposObrigatorios = validarCamposObrigatorios(dados);
        let errosSenhasDiferentes = validarConfirmacaoSenha(dados.senha, dados.confirmacao);
        setErros({ ...errosCamposObrigatorios, ...errosSenhasDiferentes });
        return checarListaVazia(errosCamposObrigatorios) && checarListaVazia(errosSenhasDiferentes);
    };
    async function alterarSenha() {
        if (validarCampos()) {
            await servicoAlterarUsuario({ cpf: cpfVerificado, senha: dados.senha, tokenRecuperacao });
            setTokenRecuperacao(null);
            mostrarToast(referenciaToast, "Senha redefinida com sucesso! Redirecionando ao Login...",
                "sucesso");
        }
    };
    function navegarLogarUsuario() {
        setCpfVerificado("");
        setNovaSenha({});
        navegar("/");
    };
    function alterarEstado(event) {
        const chave = event.target.name || event.value;
        const valor = event.target.value;
        setDados({ ...dados, [chave]: valor });
    };
    return (
        <div className={estilizarModal()}>
            <Toast ref={referenciaToast} onHide={navegarLogarUsuario} position="bottom-center" />
            <div className={estilizarDivCampo()}>
                <label className={estilizarLabel()}>Senha e Confirmar Senha*:</label>
                <Password name="senha" inputClassName={estilizarPasswordTextInputBorder()} toggleMask
                    className={estilizarPasswordInput(erros.senha)} size={TAMANHOS.SENHA}
                    value={dados.senha} onChange={alterarEstado} />
                <Password name="confirmacao" inputClassName={estilizarPasswordTextInputBorder()} toggleMask
                    className={estilizarPasswordInput(erros.senha || erros.confirmacao_senha)}
                    size={TAMANHOS.SENHA} feedback={false} value={dados.confirmacao}
                    onChange={alterarEstado} />
                <MostrarMensagemErro mensagem={erros.senha || erros.confirmacao} />
            </div>
            <Button className={estilizarBotao()} label="Salvar" onClick={alterarSenha} />
        </div>
    );
};