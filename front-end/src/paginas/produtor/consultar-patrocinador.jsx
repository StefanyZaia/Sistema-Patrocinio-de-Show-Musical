import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import { InputMask } from "primereact/inputmask";
import { InputText } from "primereact/inputtext";
import ContextoUsuario from "../../contextos/contexto-usuario";
import ContextoProdutor from "../../contextos/contexto-produtor";
import { ANO_MASCARA, TELEFONE_MASCARA } from "../../utilitarios/mascaras";
import {
    TAMANHOS, estilizarBotaoRetornar, estilizarCard, estilizarDivCampo, estilizarDivider,
    estilizarFlex, estilizarInlineFlex, estilizarInputMask, estilizarInputText, estilizarLabel
}
    from "../../utilitarios/estilos";
export default function ConsultarPatrocinador() {
    const { usuarioLogado } = useContext(ContextoUsuario);
    const { patrocinadorInteressado } = useContext(ContextoProdutor);
    const dados = {
        nome: patrocinadorInteressado?.usuario?.nome, tipo: patrocinadorInteressado?.tipo,
        ano_inicio_patrocinio: patrocinadorInteressado?.ano_inicio_patrocinio,
        data_inicio_empresa: patrocinadorInteressado?.data_inicio_empresa,
        telefone: patrocinadorInteressado?.telefone
    };
    const navegar = useNavigate();
    function retornarConsultarPrioridade() { navegar("../consultar-prioridade"); };
    return (
        <div className={estilizarFlex()}>
            <Card title="Consultar Patrocinador" className={estilizarCard(usuarioLogado.cor_tema)}>
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuarioLogado.cor_tema)}>Nome*:</label>
                    <InputText name="nome" className={estilizarInputText(null, 400, usuarioLogado.cor_tema)}
                        value={dados.nome} disabled />
                </div>
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuarioLogado.cor_tema)}>Tipo*:</label>
                    <InputText name="tipo" className={estilizarInputText(null, 300, usuarioLogado.cor_tema)}
                        value={dados.tipo} disabled />
                </div>
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuarioLogado.cor_tema)}>Ano de Inicio do Patrocinio*:</label>
                    <InputMask name="ano_inicio_patrocinio" autoClear size={TAMANHOS.ANO} mask={ANO_MASCARA}
                        value={dados.ano_inicio_patrocinio}

                        className={estilizarInputMask(null, usuarioLogado.cor_tema)} disabled />
                </div>
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(usuarioLogado.cor_tema)}>Data de Inicio da Empresa*:</label>
                    <InputText name="data_inicio_empresa" type="date" value={dados.data_inicio_empresa}
                        className={estilizarInputText(null, usuarioLogado.cor_tema)} disabled />
                </div>
                <div className={estilizarDivCampo()}>
                    <label className={estilizarLabel(dados.cor_tema)}>Telefone*:</label>
                    <InputMask name="telefone" autoClear size={TAMANHOS.TELEFONE} mask={TELEFONE_MASCARA}
                        className={estilizarInputMask(null, dados.cor_tema)} value={dados.telefone} disabled />
                </div>
                <Divider className={estilizarDivider(dados.cor_tema)} />
                <div className={estilizarInlineFlex()}>
                    <Button className={estilizarBotaoRetornar()} label="Retornar"
                        onClick={retornarConsultarPrioridade} />
                </div>
            </Card>
        </div>
    );
};