export default function mostrarToast(referenciaToast, mensagem, tipo) {
    referenciaToast.current.show({
        severity: tipo === "sucesso" ? "success" : "error",
        summary: tipo === "sucesso" ? "Sucesso" : "Erro",
        detail: mensagem,
        life: 2000
    });
}