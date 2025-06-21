import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Divider } from "primereact/divider";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import { TriStateCheckbox } from "primereact/tristatecheckbox";
import ContextoUsuario from "../../contextos/contexto-usuario";
import ContextoProdutor from "../../contextos/contexto-produtor";
import mostrarToast from "../../utilitarios/mostrar-toast";
import { servicoBuscarPrioridadesShow } from "../../servicos/servicos-produtor";
import {
    TAMANHOS, estilizarBotaoRetornar, estilizarBotaoTabela, estilizarCard,
    estilizarColumnHeader, estilizarColunaConsultar, estilizarDataTable, estilizarDataTablePaginator,
    estilizarDivider, estilizarFilterMenu, estilizarFlex, estilizarTriStateCheckbox
}
    from "../../utilitarios/estilos";
export default function PesquisarPrioridades() {
    const referenciaToast = useRef(null);
    const { usuarioLogado } = useContext(ContextoUsuario);
    const { prioridadeConsultada, setPrioridadeConsultada,
        showConsultado } = useContext(ContextoProdutor);
    const [listaPrioridades, setListaPrioridades] = useState([]);
    const navegar = useNavigate();
    const opcoesGeneroMusical = [{ label: "PostHardcore", value: "PostHardcore" },
    { label: "Metalcore", value: "Metalcore" },
    { label: "PopPunk", value: "PopPunk" }];
    function retornarCadastrarShow() {
        setPrioridadeConsultada(null);
        navegar("../cadastrar-show");
    };
    function ConsultarTemplate(prioridade) {
        return (
            <Button icon="pi pi-search"
                className={estilizarBotaoTabela(usuarioLogado.cor_tema,
                    prioridadeConsultada?.id === prioridade.id)}
                tooltip="Consultar prioridade" tooltipOptions={{ position: 'top' }}
                onClick={() => {
                    setPrioridadeConsultada(prioridade);
                    navegar("../consultar-prioridade");;
                }} />
        );
    };
    function DropdownAreaTemplate(opcoes) {
        function alterarFiltroDropdown(event) {
            return opcoes.filterCallback(event.value, opcoes.index);
        };
        return <Dropdown value={opcoes.value} options={opcoesGeneroMusical} placeholder="Selecione"
            onChange={alterarFiltroDropdown} showClear />;
    };
    function BooleanBodyTemplate(prioridade) {
        if (prioridade.show_gratuito) return "Sim";
        else return "Nao";
    };
    function BooleanFilterTemplate(opcoes) {
        function alterarFiltroTriState(event) { return opcoes.filterCallback(event.value); };
        return (
            <div>
                <label>Show Gratuito:</label>
                <TriStateCheckbox
                    className={estilizarTriStateCheckbox(usuarioLogado?.cor_tema)} value={opcoes.value}
                    onChange={alterarFiltroTriState} />
            </div>
        );
    };
    useEffect(() => {
        let desmontado = false;
        async function buscarPrioridadesShow() {
            try {
                const response = await servicoBuscarPrioridadesShow(showConsultado?.id);
                if (!desmontado && response.data) setListaPrioridades(response.data);
            } catch (error) { mostrarToast(referenciaToast, error.response.data.erro, "error"); }
        };
        buscarPrioridadesShow();
        return () => desmontado = true;
    }, [showConsultado?.id]);
    return (
        <div className={estilizarFlex()}>
            <Toast ref={referenciaToast} position="bottom-center" />
            <Card title="Prioridades Cadastradas" className={estilizarCard(usuarioLogado.cor_tema)}>
                <DataTable dataKey="id" size="small" paginator rows={TAMANHOS.MAX_LINHAS_TABELA}
                    emptyMessage="Nenhuma prioridade encontrada." value={listaPrioridades}
                    responsiveLayout="scroll" breakpoint="490px" removableSort
                    className={estilizarDataTable()}
                    paginatorClassName={estilizarDataTablePaginator(usuarioLogado.cor_tema)}>
                    <Column bodyClassName={estilizarColunaConsultar()} body={ConsultarTemplate}
                        headerClassName={estilizarColumnHeader(usuarioLogado.cor_tema)} />
                    <Column field="patrocinador.usuario.nome" header="Patrocinador" filter showFilterOperator={false}
                        headerClassName={estilizarColumnHeader(usuarioLogado.cor_tema)} sortable />
                    <Column field="show.nome_show" header="Show" filter showFilterOperator={false}
                        headerClassName={estilizarColumnHeader(usuarioLogado.cor_tema)} sortable />
                    <Column headerClassName={estilizarColumnHeader(usuarioLogado.cor_tema)}
                        field="show.genero_musical" header="Genero Musical" filter filterMatchMode="equals"
                        filterElement={DropdownAreaTemplate} showClearButton={false}
                        showFilterOperator={false} showFilterMatchModes={false}
                        filterMenuClassName={estilizarFilterMenu()} showFilterMenuOptions={false} sortable />
                    <Column field="show_gratuito" header="Show Gratuito" dataType="boolean" filter
                        showFilterOperator={false} body={BooleanBodyTemplate}
                        filterElement={BooleanFilterTemplate} filterMatchMode="equals"

                        showClearButton={false} showAddButton={false}
                        filterMenuClassName={estilizarFilterMenu()}

                        headerClassName={estilizarColumnHeader(usuarioLogado.cor_tema)} sortable />
                </DataTable>
                <Divider className={estilizarDivider()} />
                <Button className={estilizarBotaoRetornar()} label="Retornar"
                    onClick={retornarCadastrarShow} />
            </Card>
        </div>
    );
}