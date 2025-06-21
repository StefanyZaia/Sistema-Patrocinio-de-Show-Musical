import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Divider } from "primereact/divider";
import { Dropdown } from "primereact/dropdown";
import ContextoProdutor from "../../contextos/contexto-produtor";
import ContextoUsuario from "../../contextos/contexto-usuario";
import { servicoBuscarShowsProdutor } from "../../servicos/servicos-produtor";
import { TriStateCheckbox } from "primereact/tristatecheckbox";
import mostrarToast from "../../utilitarios/mostrar-toast";
import {
    TAMANHOS, estilizarBotao, estilizarBotaoRetornar, estilizarBotaoTabela, estilizarCard,
    estilizarColunaConsultar, estilizarColumnHeader, estilizarDataTable, estilizarDataTablePaginator,
    estilizarDivider, estilizarFilterMenu, estilizarFlex, estilizarTriStateCheckbox
}
    from "../../utilitarios/estilos";
export default function AdministrarShows() {
    const referenciaToast = useRef(null);
    const { usuarioLogado } = useContext(ContextoUsuario);
    const { showConsultado, setShowConsultado } = useContext(ContextoProdutor);
    const [listaShows, setListaShows] = useState([]);
    const navegar = useNavigate();
    const opcoesGeneroMusical = [{ label: "PostHardcore", value: "PostHardcore" },
    { label: "Metalcore", value: "Metalcore" },
    { label: "PopPunk", value: "PopPunk" }];
    function retornarPaginaInicial() { navegar("/pagina-inicial"); };
    function adicionarShow() {
        setShowConsultado(null);
        navegar("../cadastrar-show");
    };
    function ConsultarTemplate(show) {
        function consultar() {
            setShowConsultado(show);
            navegar("../cadastrar-show");
        };
        return (
            <Button icon="pi pi-search"
                className={estilizarBotaoTabela(usuarioLogado.cor_tema,
                    showConsultado?.id === show.id)}
                tooltip="Consultar Show" tooltipOptions={{ position: 'top' }} onClick={consultar} />
        );
    };
    function DropdownAreaTemplate(opcoes) {
        function alterarFiltroDropdown(event) { opcoes.filterApplyCallback(event.value); };
        return <Dropdown value={opcoes.value} options={opcoesGeneroMusical} placeholder="Selecione"
            onChange={alterarFiltroDropdown} showClear />;
    };
    function BooleanBodyTemplate(show) {
        if (show.show_gratuito) return "Sim";
        else return "Não";
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
        async function buscarShowsProdutor() {
            try {
                const response = await servicoBuscarShowsProdutor(usuarioLogado.cpf);
                if (!desmontado && response.data) { setListaShows(response.data); }
            } catch (error) {
                const erro = error.response.data.erro;
                if (erro) mostrarToast(referenciaToast, erro, "error");
            }
        };
        buscarShowsProdutor();
        return () => desmontado = true;
    }, [usuarioLogado.cpf]);

    return (
        <div className={estilizarFlex()}>
            <Card title="Administrar Show" className={estilizarCard(usuarioLogado.cor_tema)}>
                <DataTable dataKey="id" size="small" paginator rows={TAMANHOS.MAX_LINHAS_TABELA}
                    emptyMessage="Nenhum show encontrado." value={listaShows}
                    responsiveLayout="scroll" breakpoint="890px" removableSort
                    className={estilizarDataTable()}
                    paginatorClassName={estilizarDataTablePaginator(usuarioLogado.cor_tema)}>
                    <Column bodyClassName={estilizarColunaConsultar()} body={ConsultarTemplate}
                        headerClassName={estilizarColumnHeader(usuarioLogado.cor_tema)} />
                    <Column field="nome_show" header="Nome Show" filter showFilterOperator={false}
                        headerClassName={estilizarColumnHeader(usuarioLogado.cor_tema)} sortable />
                    <Column headerClassName={estilizarColumnHeader(usuarioLogado.cor_tema)}
                        field="genero_musical" header="Genero Musical" filter filterMatchMode="equals"
                        filterElement={DropdownAreaTemplate} showClearButton={false}
                        showFilterOperator={false} showFilterMatchModes={false}
                        filterMenuClassName={estilizarFilterMenu()} showFilterMenuOptions={false} sortable />
                    <Column field="localizacao" header="Localizacao" filter showFilterOperator={false}
                        headerClassName={estilizarColumnHeader(usuarioLogado.cor_tema)} sortable />
                    <Column field="show_gratuito" header="Show Gratuito" filter
                        showFilterOperator={false}

                        headerClassName={estilizarColumnHeader(usuarioLogado.cor_tema)} sortable
                        filterMatchMode="equals" filterElement={BooleanFilterTemplate}
                        body={BooleanBodyTemplate} showClearButton={false} showAddButton={false}
                        filterMenuClassName={estilizarFilterMenu()} dataType="boolean" />
                </DataTable>
                <Divider className={estilizarDivider()} />
                <Button className={estilizarBotaoRetornar()} label="Retornar"
                    onClick={retornarPaginaInicial} />
                <Button className={estilizarBotao()} label="Adicionar" onClick={adicionarShow} />
            </Card>
        </div>
    );
}

