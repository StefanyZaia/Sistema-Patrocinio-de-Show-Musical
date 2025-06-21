import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Divider } from "primereact/divider";
import { TriStateCheckbox } from "primereact/tristatecheckbox";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import ContextoUsuario from "../../contextos/contexto-usuario";
import ContextoPatrocinador from "../../contextos/contexto-patrocinador";
import { servicoBuscarShows } from "../../servicos/servicos-patrocinador";
import mostrarToast from "../../utilitarios/mostrar-toast";
import {
    TAMANHOS, estilizarBotaoRetornar, estilizarBotaoTabela, estilizarCard,
    estilizarColumnHeader, estilizarColunaConsultar, estilizarDataTable, estilizarDataTablePaginator,
    estilizarDivider, estilizarFilterMenu, estilizarFlex, estilizarTriStateCheckbox
}
    from "../../utilitarios/estilos";
export default function PesquisarShows() {
    const referenciaToast = useRef(null);
    const { usuarioLogado } = useContext(ContextoUsuario);
    const { showConsultado, setShowConsultado, setShowSelecionado }
        = useContext(ContextoPatrocinador);
    const [listaShows, setListaShows] = useState([]);
    const navegar = useNavigate();
    const opcoesGeneroMusical = [{ label: "PostHardcore", value: "PostHardcore" },
    { label: "Metalcore", value: "Metalcore" },
    { label: "PopPunk", value: "PopPunk" }];
    function retornarCadastrarPrioridade() {
        setShowSelecionado(showConsultado);
        setShowConsultado(null);
        navegar("../cadastrar-prioridade");
    };
    function ConsultarTemplate(show) {
        return (
            <Button icon="pi pi-search"
                className={estilizarBotaoTabela(usuarioLogado.cor_tema,
                    showConsultado?.id === show.id)}
                tooltip="Consultar Show" tooltipOptions={{ position: 'top' }}
                onClick={() => {
                    setShowConsultado(show);
                    navegar("../consultar-show");;
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
        async function buscarShows() {
            try {
                const response = await servicoBuscarShows();
                if (!desmontado && response.data) setListaShows(response.data);
            } catch (error) { mostrarToast(referenciaToast, error.response.data.erro, "error"); }
        };
        buscarShows();
        return () => desmontado = true;
    }, [usuarioLogado.cpf]);
    return (
        <div className={estilizarFlex()}>
            <Toast ref={referenciaToast} position="bottom-center" />
            <Card title="Pesquisar Show" className={estilizarCard(usuarioLogado.cor_tema)}>
                <DataTable dataKey="id" size="small" paginator rows={TAMANHOS.MAX_LINHAS_TABELA}
                    emptyMessage="Nenhum show encontrado." value={listaShows}
                    responsiveLayout="scroll" breakpoint="490px" removableSort
                    className={estilizarDataTable()}
                    paginatorClassName={estilizarDataTablePaginator(usuarioLogado.cor_tema)}>
                    <Column bodyClassName={estilizarColunaConsultar()} body={ConsultarTemplate}
                        headerClassName={estilizarColumnHeader(usuarioLogado.cor_tema)} />
                    <Column field="produtor.usuario.nome" header="Nome do Produtor" filter
                        showFilterOperator={false}

                        headerClassName={estilizarColumnHeader(usuarioLogado.cor_tema)} sortable />
                    <Column field="nome_show" header="Nome do Show" filter showFilterOperator={false}
                        headerClassName={estilizarColumnHeader(usuarioLogado.cor_tema)} sortable />
                    <Column headerClassName={estilizarColumnHeader(usuarioLogado.cor_tema)}
                        field="genero_musical" header="Genero Musical" filter filterMatchMode="equals"
                        filterElement={DropdownAreaTemplate} showClearButton={false}
                        showFilterOperator={false} showFilterMatchModes={false}
                        filterMenuClassName={estilizarFilterMenu()} showFilterMenuOptions={false} sortable />
                    <Column field="localizacao" header="Localização" filter showFilterOperator={false}
                        headerClassName={estilizarColumnHeader(usuarioLogado.cor_tema)} sortable />
                    <Column field="show_gratuito" header="Show Gratuito" dataType="boolean" filter
                        showFilterOperator={false}

                        body={BooleanBodyTemplate} filterElement={BooleanFilterTemplate}
                        filterMatchMode="equals" showClearButton={false} showAddButton={false}
                        filterMenuClassName={estilizarFilterMenu()}

                        headerClassName={estilizarColumnHeader(usuarioLogado.cor_tema)} sortable />
                </DataTable>
                <Divider className={estilizarDivider()} />
                <Button className={estilizarBotaoRetornar()} label="Retornar"
                    onClick={retornarCadastrarPrioridade} />
            </Card>
        </div>
    );
}