import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Checkbox } from "primereact/checkbox";
import { Divider } from "primereact/divider";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import ContextoUsuario from "../../contextos/contexto-usuario";
import ContextoProdutor from "../../contextos/contexto-produtor";
import {
    estilizarBotao, estilizarBotaoRetornar, estilizarCard, estilizarCheckbox,
    estilizarDivCampo, estilizarDivider, estilizarFlex, estilizarInlineFlex, estilizarInputText,
    estilizarLabel
} from "../../utilitarios/estilos";
export default function ConsultarPrioridade() {
    const { usuarioLogado } = useContext(ContextoUsuario);
    const { prioridadeConsultada, setPatrocinadorInteressado } = useContext(ContextoProdutor);
    const dados = {
        nome_patrocinador: prioridadeConsultada?.patrocinador?.usuario?.nome,
        show_gratuito: prioridadeConsultada?.show_gratuito,
        justificativa: prioridadeConsultada?.justificativa,
        nome_show: prioridadeConsultada?.show.nome_show
    };
    const navegar = useNavigate();
    function retornarPesquisarPrioridades() { navegar("../pesquisar-prioridades"); };
    function consultarPatrocinadorInteressado() {
        setPatrocinadorInteressado(prioridadeConsultada.patrocinador);
        navegar("../consultar-patrocinador-interessado");
    };
    return (
        <div className={estilizarFlex()}>
            <Card title="Consultar Prioridade" className={estilizarCard(usuarioLogado.cor_tema)}>
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuarioLogado.cor_tema)}>Patrocinador*:</label>
                    <InputText name="nome_patrocinador"
                        className={estilizarInputText(null, 400, usuarioLogado.cor_tema)}

                        value={dados.nome_patrocinador} disabled />
                </div>
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuarioLogado.cor_tema)}>Show Gratuito*:</label>
                    <Checkbox name="show_gratuito" checked={dados.show_gratuito}
                        className={estilizarCheckbox()} autoResize disabled />
                </div>
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuarioLogado.cor_tema)}>Justificativa*:</label>
                    <InputTextarea name="justificativa"
                        className={estilizarInputText(null, 400, usuarioLogado.cor_tema)}

                        value={dados.justificativa} disabled />
                </div>
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuarioLogado.cor_tema)}>Show*</label>
                    <InputText name="nome_show"
                        className={estilizarInputText(null, 400, usuarioLogado.cor_tema)}

                        value={dados.nome_show} disabled />
                </div>
                <Divider className={estilizarDivider()} />
                <div className={estilizarInlineFlex()}>
                    <Button className={estilizarBotaoRetornar()} label="Retornar"
                        onClick={retornarPesquisarPrioridades} />
                    <Button className={estilizarBotao()} label="Patrocinador" onClick={consultarPatrocinadorInteressado} />
                </div>
            </Card>
        </div>
    );
}