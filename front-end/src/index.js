import React from 'react';
import { hydrateRoot, createRoot } from "react-dom/client";
import { locale, addLocale } from 'primereact/api';
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "/node_modules/primeflex/primeflex.css";
import "primeicons/primeicons.css";
import "./global.css";
import portugues from "./utilitarios/portugues.json"
import Rotas from "./rotas/rotas-aplicacao";
import { ProvedorUsuario } from './contextos/contexto-usuario';
addLocale("pt", portugues)
locale("pt")
const rootElement = document.getElementById("root");
const App = (<ProvedorUsuario><Rotas /></ProvedorUsuario>);
if (rootElement.hasChildNodes()) hydrateRoot(App, rootElement);
else createRoot(rootElement).render(App);