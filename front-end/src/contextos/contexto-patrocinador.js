import { createContext, useState } from "react";
const ContextoPatrocinador = createContext();
export default ContextoPatrocinador;
export function ProvedorPatrocinador({ children }) {
    const [prioridadeConsultada, setPrioridadeConsultada] = useState({});
    const [showConsultado, setShowConsultado] = useState({});
    const [showSelecionado, setShowSelecionado] = useState({});
    const [showPrioridade, setShowPrioridade] = useState({});
    const [produtorProponente, setProdutorProponente] = useState({});
    return (
        <ContextoPatrocinador.Provider value={{
            prioridadeConsultada, setPrioridadeConsultada, showConsultado, setShowConsultado,
            showSelecionado, setShowSelecionado, showPrioridade, setShowPrioridade, produtorProponente, setProdutorProponente
        }}>{children}</ContextoPatrocinador.Provider>
    );
}