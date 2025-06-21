import { Route, BrowserRouter, Routes } from "react-router-dom";
import RotasUsuarioLogado from "./rotas-usuario-logado";
import LogarUsuario from "../paginas/usuario/logar-usuario";
import CadastrarUsuario from "../paginas/usuario/cadastrar-usuario";
import PaginaInicial from "../paginas/usuario/pagina-inicial";
import CadastrarProdutor from "../paginas/produtor/cadastrar-produtor";
import RecuperarAcesso from "../paginas/usuario/recuperar-acesso";
import CadastrarPatrocinador from "../paginas/patrocinador/cadastrar-patrocinador";
import { ProvedorProdutor } from "../contextos/contexto-produtor";
import { ProvedorPatrocinador } from "../contextos/contexto-patrocinador";
import RotasProdutor from "./rotas-produtor"
import RotasPatrocinador from "./rotas-patrocinador"
import AdministrarShows from "../paginas/produtor/administrar-shows";
import CadastrarShow from "../paginas/produtor/cadastrar-show";
import AdministrarPrioridades from "../paginas/patrocinador/administrar-prioridades";
import CadastrarPrioridade from "../paginas/patrocinador/cadastrar-prioridade";
import PesquisarShows from "../paginas/patrocinador/pesquisar-shows";
import ConsultarShow from "../paginas/patrocinador/consultar-show";
import PesquisarPrioridades from "../paginas/produtor/pesquisar-prioridades";
import ConsultarPrioridade from "../paginas/produtor/consultar-prioridade";
import ConsultarPatrocinador from "../paginas/produtor/consultar-patrocinador";
import ConsultarProdutor from "../paginas/patrocinador/consultar-produtor.jsx";
export default function Rotas() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<LogarUsuario />} path="/" />
                <Route element={<CadastrarUsuario />} path="criar-usuario" />
                <Route element={<RecuperarAcesso />} path="recuperar-acesso" />
                <Route element={<RotasUsuarioLogado />}>
                    <Route element={<PaginaInicial />} path="pagina-inicial" />
                    <Route element={<CadastrarUsuario />} path="atualizar-usuario" />
                    <Route element={<ProvedorProdutor><RotasProdutor /></ProvedorProdutor>}>
                        <Route element={<CadastrarProdutor />} path="cadastrar-produtor" />
                        <Route element={<AdministrarShows />} path="administrar-shows" />
                        <Route element={<CadastrarShow />} path="cadastrar-show" />
                        <Route element={<PesquisarPrioridades />} path="pesquisar-prioridades" />
                        <Route element={<ConsultarPrioridade />} path="consultar-prioridade" />
                        <Route element={<ConsultarPatrocinador />} path="consultar-patrocinador-interessado" />
                    </Route>
                    <Route element={<ProvedorPatrocinador><RotasPatrocinador /></ProvedorPatrocinador>}>
                        <Route element={<CadastrarPatrocinador />} path="cadastrar-patrocinador" />
                        <Route element={<AdministrarPrioridades />} path="administrar-prioridades" />
                        <Route element={<CadastrarPrioridade />} path="cadastrar-prioridade" />
                        <Route element={<PesquisarShows />} path="pesquisar-shows" />
                        <Route element={<ConsultarShow />} path="consultar-show" />
                        <Route element={<ConsultarProdutor/>} path="consultar-produtor-proponente"/>
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    );
};