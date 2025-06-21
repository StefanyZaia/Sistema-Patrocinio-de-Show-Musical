import { useContext } from "react";
import { Card } from "primereact/card";
import { Image } from "primereact/image";
import ContextoUsuario from "../../contextos/contexto-usuario";
import show from "../../imagens/imagem-show.jpg";
import { estilizarCard, estilizarCardHeaderCentralizado, estilizarPaginaUnica }
    from "../../utilitarios/estilos";
export default function PaginaInicial() {
    const { usuarioLogado } = useContext(ContextoUsuario);
    function HeaderCentralizado() {
        return (<div className={estilizarCardHeaderCentralizado()}>
            Patrocinio de Show Musical</div>)
    };
    return (
        <div className={estilizarPaginaUnica()}>
            <Card header={HeaderCentralizado} className={estilizarCard(usuarioLogado.cor_tema)}>
                <Image src={show} alt="We will rock you!" width={1100} />
            </Card>
        </div>
    );
};