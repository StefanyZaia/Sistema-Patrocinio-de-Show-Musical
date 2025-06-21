export default function formatarPerfil(perfil) {
    switch (perfil) {
        case "produtor": return "Produtor";
        case "patrocinador": return "Patrocinador";
        default: return;
    }
};