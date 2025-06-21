import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Checkbox } from "primereact/checkbox";
import { Divider } from "primereact/divider";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import ContextoUsuario from "../../contextos/contexto-usuario";
import ContextoPatrocinador from "../../contextos/contexto-patrocinador";
import {
    estilizarBotaoRetornar, estilizarCard, estilizarCheckbox, estilizarDivCampo,
    estilizarDivider, estilizarFlex, estilizarInlineFlex, estilizarInputText, estilizarLabel, estilizarBotao
}
    from "../../utilitarios/estilos";
export default function ConsultarShow() {
    const { usuarioLogado } = useContext(ContextoUsuario);
    const { showConsultado, showPrioridade, produtorProponente, setProdutorProponente } = useContext(ContextoPatrocinador);
    const dados = {
        nome_produtor: showConsultado?.produtor?.usuario?.nome
            || showPrioridade?.produtor?.usuario?.nome,
        nome_show: showConsultado?.nome_show || showPrioridade?.nome_show,
        genero_musical: showConsultado?.genero_musical || showPrioridade?.genero_musical,
        localizacao: showConsultado?.localizacao || showPrioridade?.localizacao,
        data_show: showConsultado?.data_show || showPrioridade?.data_show,
        descricao: showConsultado?.descricao || showPrioridade?.descricao,
        show_gratuito: showConsultado?.show_gratuito
            || showPrioridade?.show_gratuito,
        categoria: showConsultado?.categoria || showPrioridade?.categoria
    };
    const navegar = useNavigate();
    function retornar() {
        if (showConsultado) navegar("../pesquisar-shows");
        else if (showPrioridade) navegar("../cadastrar-prioridade");
    };
    function consultarProdutorProponente() {
        if (showConsultado) {
            setProdutorProponente(showConsultado.produtor);
        } else {
            setProdutorProponente(showPrioridade?.produtor); 
        }
        setTimeout(() => {
            navegar("../consultar-produtor-proponente");
        }, 0);
    };
    return (
        <div className={estilizarFlex()}>
            <Card title="Consultar Show" className={estilizarCard(usuarioLogado.cor_tema)}>
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuarioLogado.cor_tema)}>Produtor*:</label>
                    <InputText name="nome_produtor"
                        className={estilizarInputText(null, 400, usuarioLogado.cor_tema)}

                        value={dados.nome_produtor} disabled />
                </div>
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuarioLogado.cor_tema)}>Nome do Show*:</label>
                    <InputText name="nome_show" className={estilizarInputText(null, 400, usuarioLogado.cor_tema)}
                        value={dados.nome_show} disabled />
                </div>
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuarioLogado.cor_tema)}>Gênero Musical*:</label>
                    <InputText name="genero_musical"
                        className={estilizarInputText(null, 200, usuarioLogado.cor_tema)}
                        value={dados.genero_musical} disabled />
                </div>
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuarioLogado.cor_tema)}>Localização*:</label>
                    <InputText name="localizacao"
                        className={estilizarInputText(null, 350, usuarioLogado.cor_tema)}
                        value={dados.localizacao} disabled />
                </div>
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuarioLogado.cor_tema)}>Data do Show*:</label>
                    <InputText name="data_show" type="date" value={dados.data_show}
                        className={estilizarInputText(null, usuarioLogado.cor_tema)} disabled />
                </div>
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuarioLogado.cor_tema)}>Descrição*:</label>
                    <InputTextarea name="descricao" value={dados.descricao}
                        className={estilizarInputText(null, 400, usuarioLogado.cor_tema)} autoResize disabled />
                </div>
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuarioLogado.cor_tema)}>Show Gratuito*:</label>
                    <Checkbox name="show_gratuito" checked={dados.show_gratuito}
                        className={estilizarCheckbox(null)} autoResize disabled />
                </div>
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuarioLogado.cor_tema)}>Categoria*:</label>
                    <InputText name="categoria"
                        className={estilizarInputText(null, 100, usuarioLogado.cor_tema)}
                        value={dados.categoria} autoResize disabled />
                </div>
                <Divider className={estilizarDivider()} />
                <div className={estilizarInlineFlex()}>
                    <Button className={estilizarBotaoRetornar()} label="Retornar" onClick={retornar} />
                    <Button className={estilizarBotao()} label="Produtor" onClick={consultarProdutorProponente} />
                </div>
            </Card>
        </div>
    );
}