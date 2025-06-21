import { useContext, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { InputMask } from "primereact/inputmask";
import { Password } from "primereact/password";
import { Toast } from "primereact/toast";
import ContextoUsuario from "../../contextos/contexto-usuario";
import { servicoLogarUsuario } from "../../servicos/servicos-usuario";
import mostrarToast from "../../utilitarios/mostrar-toast";
import { CPF_MASCARA } from "../../utilitarios/mascaras";
import { MostrarMensagemErro, checarListaVazia, validarCamposObrigatorios }
    from "../../utilitarios/validacoes";
import {
    TAMANHOS, estilizarBotao, estilizarCard, estilizarDivCampo, estilizarFlex,
    estilizarInputMask, estilizarLabel, estilizarLink, estilizarLogo, estilizarPasswordInput,
    estilizarPasswordTextInputBorder, estilizarPaginaUnica
} from "../../utilitarios/estilos";
export default function LogarUsuario() {
    const referenciaToast = useRef(null);
    const { setUsuarioLogado } = useContext(ContextoUsuario);
    const [dados, setDados] = useState({ nome_login: "", senha: "" });
    const [erros, setErros] = useState({});
    const navegar = useNavigate();
    function validarCampos() {
        const erros = validarCamposObrigatorios(dados);
        setErros(erros);
        return checarListaVazia(erros);
    };
    async function logarUsuario() {
        if (validarCampos()) {
            try {
                const response = await servicoLogarUsuario(dados);
                setUsuarioLogado({
                    ...response.data?.usuarioLogado, cpf: dados.nome_login,
                    cadastrado: true
                });
                navegar("/pagina-inicial");
            } catch (error) { mostrarToast(referenciaToast, error.response.data.erro, "error"); }
        }
    };
    function alterarEstado(event) {
        const chave = event.target.name || event.value;
        const valor = event.target.value;
        setDados({ ...dados, [chave]: valor });
    };
    return (
        <div className={estilizarPaginaUnica()}>
            <Toast ref={referenciaToast} position="bottom-center" />
            <h1 className={estilizarLogo()}>Patrocinio de Show Musical</h1>
            <Card title="Login" className={estilizarCard()}>
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel()}>Usuario</label>
                    <InputMask name="nome_login" size={TAMANHOS.CPF}
                        className={estilizarInputMask(erros.nome_login)}

                        autoClear mask={CPF_MASCARA} value={dados.nome_login} onChange={alterarEstado} />
                    <MostrarMensagemErro mensagem={erros.nome_login} />
                </div>
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel()}>Senha</label>
                    <Password name="senha" inputClassName={estilizarPasswordTextInputBorder()}
                        className={estilizarPasswordInput(erros.senha)} size={TAMANHOS.SENHA}
                        value={dados.senha} feedback={false} toggleMask onChange={alterarEstado} />
                    <MostrarMensagemErro mensagem={erros.senha} />
                </div>
                <div className={estilizarFlex("center")}>
                    <Button className={estilizarBotao()} label="Login" onClick={logarUsuario} />
                    <Link className={estilizarLink()} to="/recuperar-acesso">Recuperar Acesso de Usuario</Link>
                    <Link className={estilizarLink()} to="/criar-usuario">Cadastrar Usuario</Link>
                </div>
            </Card>
        </div>
    );
}