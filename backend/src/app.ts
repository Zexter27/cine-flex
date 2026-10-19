import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { configuracion } from "./configuracion/entorno";
import { manejarErrores, rutaNoEncontrada } from "./middlewares/errores.middleware";
import rutas from "./rutas/api.rutas";

export const app = express();

app.use(helmet());
app.use(morgan(configuracion.formatoRegistro));
app.use(express.json({ limit: configuracion.limiteCuerpoBytes }));
app.use(express.static(configuracion.rutaInterfaz));
app.use(rutas);
app.use(rutaNoEncontrada);
app.use(manejarErrores);
