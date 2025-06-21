import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import UsuarioContext from "../contextos/contexto-usuario";
export default function RotasProdutor() {
    const { usuarioLogado } = useContext(UsuarioContext);
    if (usuarioLogado.perfil === "produtor") return <Outlet />
    else return <Navigate to="/" />;
}