import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Divider } from "primereact/divider";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import ContextoUsuario from "../../contextos/contexto-usuario";
import ContextoPatrocinador from "../../contextos/contexto-patrocinador";
import mostrarToast from "../../utilitarios/mostrar-toast";
import { servicoBuscarPrioridadesPatrocinador } from "../../servicos/servicos-patrocinador";
import {
    TAMANHOS, estilizarBotao, estilizarBotaoRetornar, estilizarBotaoTabela, estilizarCard,
    estilizarColumnHeader, estilizarColunaConsultar, estilizarDataTable, estilizarDataTablePaginator,
    estilizarDivider, estilizarFilterMenu, estilizarFlex
}
    from "../../utilitarios/estilos";
export default function AdministrarPrioridades() {
    const referenciaToast = useRef(null);
    const { usuarioLogado } = useContext(ContextoUsuario);
    const { prioridadeConsultada, setPrioridadeConsultada, setShowSelecionado } =
        useContext(ContextoPatrocinador);
    const [listaPrioridades, setListaPrioridades] = useState([]);
    const navegar = useNavigate();
    const opcoesGeneroMusical = [{ label: "PostHardcore", value: "PostHardcore" },
    { label: "Metalcore", value: "Metalcore" },
    { label: "PopPunk", value: "PopPunk" }];
    function retornarPaginaInicial() { navegar("/pagina-inicial"); };
    function adicionarPrioridade() {
        setPrioridadeConsultada(null);
        setShowSelecionado(null);
        navegar("../cadastrar-prioridade");
    };
    function ConsultarTemplate(prioridade) {
        function consultar() {
            setPrioridadeConsultada(prioridade);
            setShowSelecionado(null);
            navegar("../cadastrar-prioridade");
        };
        return (
            <Button icon="pi pi-search"
                className={estilizarBotaoTabela(usuarioLogado.cor_tema,
                    prioridadeConsultada?.id === prioridade.id)}
                tooltip="Consultar prioridade" tooltipOptions={{ position: 'top' }} onClick={consultar} />
        );
    };
    function DropdownAreaTemplate(opcoes) {
        function alterarFiltroDropdown(event) {
            return opcoes.filterCallback(event.value, opcoes.index);
        };
        return <Dropdown value={opcoes.value} options={opcoesGeneroMusical} placeholder="Selecione"
            onChange={alterarFiltroDropdown} showClear />;
    };
    useEffect(() => {
        let desmontado = false;
        async function buscarPrioridadesPatrocinador() {
            try {
                const response = await servicoBuscarPrioridadesPatrocinador(usuarioLogado.cpf);
                if (!desmontado && response.data) setListaPrioridades(response.data);
            } catch (error) { mostrarToast(referenciaToast, error.response.data.erro, "error"); }
        };
        buscarPrioridadesPatrocinador();
        return () => desmontado = true;
    }, [usuarioLogado.cpf]);
    return (
        <div className={estilizarFlex()}>
            <Toast ref={referenciaToast} position="bottom-center" />
            <Card title="Administrar Prioridades" className={estilizarCard(usuarioLogado.cor_tema)}>
                <DataTable dataKey="id" size="small" paginator rows={TAMANHOS.MAX_LINHAS_TABELA}
                    emptyMessage="Nenhuma prioridade encontrada." value={listaPrioridades}
                    responsiveLayout="scroll" breakpoint="490px" removableSort
                    className={estilizarDataTable()}
                    paginatorClassName={estilizarDataTablePaginator(usuarioLogado.cor_tema)}>
                    <Column bodyClassName={estilizarColunaConsultar()} body={ConsultarTemplate}
                        headerClassName={estilizarColumnHeader(usuarioLogado.cor_tema)} />
                    <Column field="show.produtor.usuario.nome" header="Produtor" filter
                        showFilterOperator={false}

                        headerClassName={estilizarColumnHeader(usuarioLogado.cor_tema)} sortable />
                    <Column headerClassName={estilizarColumnHeader(usuarioLogado.cor_tema)}
                        field="show.genero_musical" header="Genero Musical" filter filterMatchMode="equals"
                        filterElement={DropdownAreaTemplate} showClearButton={false}
                        showFilterOperator={false} showFilterMatchModes={false}
                        filterMenuClassName={estilizarFilterMenu()} showFilterMenuOptions={false} sortable />
                    <Column field="show.nome_show" header="Show" filter showFilterOperator={false}
                        headerClassName={estilizarColumnHeader(usuarioLogado.cor_tema)} sortable />
                </DataTable>
                <Divider className={estilizarDivider()} />
                <Button className={estilizarBotaoRetornar()} label="Retornar"
                    onClick={retornarPaginaInicial} />
                <Button className={estilizarBotao()} label="Adicionar" onClick={adicionarPrioridade} />
            </Card>
        </div>
    );
}