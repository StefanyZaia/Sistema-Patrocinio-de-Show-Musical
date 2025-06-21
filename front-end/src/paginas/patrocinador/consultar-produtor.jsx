import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import ContextoUsuario from "../../contextos/contexto-usuario";
import ContextoPatrocinador from "../../contextos/contexto-patrocinador";
import {
    estilizarBotaoRetornar, estilizarCard, estilizarDivCampo, estilizarDivider, estilizarFlex,
    estilizarInlineFlex, estilizarInputText, estilizarLabel
} from "../../utilitarios/estilos";
export default function ConsultarProdutor() {
    const { usuarioLogado } = useContext(ContextoUsuario);
    const { produtorProponente } = useContext(ContextoPatrocinador);
    const dados = {
        nome_produtor: produtorProponente?.usuario?.nome,
        atuacao: produtorProponente?.atuacao,
        anos_experiencia: produtorProponente?.anos_experiencia
    };
    const navegar = useNavigate();
    function retornarConsultarShow() { navegar("/consultar-show"); };
    return (
        <div className={estilizarFlex()}>
            <Card title="Consultar Produtor" className={estilizarCard(usuarioLogado.cor_tema)}>
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuarioLogado.cor_tema)}>Produtor*:</label>
                    <InputText name="nome_produtor"
                        className={estilizarInputText(null, 400, usuarioLogado.cor_tema)}

                        value={dados.nome_produtor} disabled />
                </div>
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuarioLogado.cor_tema)}>Atuação*:</label>
                    <InputText name="atuacao"
                        className={estilizarInputText(null, 150, usuarioLogado.cor_tema)}

                        value={dados.atuacao} autoResize disabled />
                </div>
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuarioLogado.cor_tema)}>
                        Anos de Experiência*:</label>
                    <InputNumber name="anos_experiencia" size={5}
                        value={dados.anos_experiencia}

                        inputClassName={estilizarInputText(null, usuarioLogado.cor_tema)}
                        mode="decimal" min={1} disabled />
                </div>
                <Divider className={estilizarDivider(dados.cor_tema)} />
                <div className={estilizarInlineFlex()}>
                    <Button className={estilizarBotaoRetornar()} label="Retornar"
                        onClick={retornarConsultarShow} />
                </div>
            </Card>
        </div>
    );
};