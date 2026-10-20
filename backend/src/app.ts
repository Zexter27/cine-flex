import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { configuracion } from "./configuracion/entorno";
import { manejarErrores, rutaNoEncontrada } from "./middlewares/errores.middleware";
import rutas from "./rutas/api.rutas";

export const app = express();

app.disable("x-powered-by");
app.use((solicitud, respuesta, siguiente) => {
  respuesta.setHeader("Access-Control-Allow-Origin", "*");
  respuesta.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  respuesta.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (solicitud.method === "OPTIONS") {
    return respuesta.sendStatus(204);
  }
  return siguiente();
});

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:"],
        connectSrc: ["'self'", "http://localhost:3000"],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        frameAncestors: ["'none'"]
      }
    },
    crossOriginResourcePolicy: { policy: "same-site" },
    referrerPolicy: { policy: "no-referrer" }
  })
);

app.use(
  morgan((tokens, solicitud, respuesta) => {
    const metodo = tokens.method(solicitud, respuesta) ?? "-";
    const ruta = tokens.url(solicitud, respuesta) ?? "-";
    const estado = tokens.status(solicitud, respuesta) ?? "-";
    const duracion = tokens["response-time"](solicitud, respuesta) ?? "0";
    const direccion = tokens["remote-addr"](solicitud, respuesta) ?? "-";
    const agente = tokens["user-agent"](solicitud, respuesta) ?? "-";

    return `${new Date().toISOString()} | ${metodo} ${ruta} | ${estado} | ${duracion}ms | ${direccion} | ${agente}`;
  })
);
app.use(express.json({ limit: configuracion.limiteCuerpoBytes }));
app.use(express.static(configuracion.rutaInterfaz));
app.use(rutas);
app.use(rutaNoEncontrada);
app.use(manejarErrores);
