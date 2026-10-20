import { Router } from "express";
import { AsientosControlador } from "../controladores/asientos.controlador";
import { AutenticacionControlador } from "../controladores/autenticacion.controlador";
import { CarteleraControlador } from "../controladores/cartelera.controlador";
import { ReservaControlador } from "../controladores/reserva.controlador";
import { CrearReservaDto } from "../dto/crear-reserva.dto";
import { InicioSesionDto } from "../dto/inicio-sesion.dto";
import { validarDto } from "../dto/validar-dto";
import { requerirToken } from "../middlewares/autenticacion.middleware";
import { AsientosServicio } from "../servicios/asientos.servicio";
import { CarteleraServicio } from "../servicios/cartelera.servicio";
import { InicioSesionServicio } from "../servicios/inicio-sesion.servicio";
import { ReservaServicio } from "../servicios/reserva.servicio";
import { crearRespuesta } from "../comun/respuesta-http";

const rutas = Router();
const autenticacion = new AutenticacionControlador(new InicioSesionServicio());
const cartelera = new CarteleraControlador(new CarteleraServicio());
const asientos = new AsientosControlador(new AsientosServicio());
const reservas = new ReservaControlador(new ReservaServicio());

rutas.get("/health", (_solicitud, respuesta) => {
  respuesta.status(200).json(
    crearRespuesta(true, "El servicio está disponible.", { estado: "disponible" })
  );
});
rutas.post("/login", validarDto(InicioSesionDto), autenticacion.iniciarSesion);
rutas.get("/cartelera", requerirToken, cartelera.listar);
rutas.get("/asientos/disponibles", asientos.listarDisponibles);
rutas.post("/reserva", requerirToken, validarDto(CrearReservaDto), reservas.crear);
rutas.post("/pagos/mock", requerirToken, validarDto(CrearReservaDto), reservas.crear);

export default rutas;
