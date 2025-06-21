import { createContext, useState } from "react";
const ContextoProdutor = createContext();
export default ContextoProdutor;
export function ProvedorProdutor({ children }) {
    const [showConsultado, setShowConsultado] = useState({});
    const [prioridadeConsultada, setPrioridadeConsultada] = useState(null);
    const [patrocinadorInteressado, setPatrocinadorInteressado] = useState(null);
    return (
        <ContextoProdutor.Provider value={{
            showConsultado, setShowConsultado, prioridadeConsultada, setPrioridadeConsultada,
            patrocinadorInteressado, setPatrocinadorInteressado
        }}>{children}</ContextoProdutor.Provider>
    );
}