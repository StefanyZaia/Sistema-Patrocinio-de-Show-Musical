import cors from "cors";
import express from "express";
import "reflect-metadata";
import { createConnection } from "typeorm";
import RotasUsuario from "./rotas/rotas-usuario";
import RotasProdutor from "./rotas/rotas-produtor";
import RotasPatrocinador from "./rotas/rotas-patrocinador";
const app = express();
const PORT = process.env.PORT
const CORS_ORIGIN = process.env.CORS_ORIGIN;
app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json());
app.use("/usuarios", RotasUsuario);
app.use("/produtores", RotasProdutor);
app.use("/patrocinadores", RotasPatrocinador);
app.listen(PORT || 3333);
const conexao = createConnection();
export default conexao;