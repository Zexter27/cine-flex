import { Router } from "express";
import { AsientosControlador } from "../controladores/asientos.controlador";
import { AutenticacionControlador } from "../controladores/autenticacion.controlador";
import { CarteleraControlador } from "../controladores/cartelera.controlador";
import { ReservaControlador } from "../controladores/reserva.controlador";
import { UsuarioControlador } from "../controladores/usuario.controlador";
import { CrearReservaDto } from "../dto/crear-reserva.dto";
import { InicioSesionDto } from "../dto/inicio-sesion.dto";
import { RegistrarUsuarioDto } from "../dto/registrar-usuario.dto";
import { validarDto } from "../dto/validar-dto";
import { requerirToken } from "../middlewares/autenticacion.middleware";
import { AsientosServicio } from "../servicios/asientos.servicio";
import { CarteleraServicio } from "../servicios/cartelera.servicio";
import { InicioSesionServicio } from "../servicios/inicio-sesion.servicio";
import { ReservaServicio } from "../servicios/reserva.servicio";
import { UsuarioServicio } from "../servicios/usuario.servicio";
import { crearRespuesta } from "../comun/respuesta-http";

const rutas = Router();
const autenticacion = new AutenticacionControlador(new InicioSesionServicio());
const cartelera = new CarteleraControlador(new CarteleraServicio());
const asientos = new AsientosControlador(new AsientosServicio());
const reservas = new ReservaControlador(new ReservaServicio());
const usuarios = new UsuarioControlador(new UsuarioServicio());

rutas.get("/health", (_solicitud, respuesta) => {
  respuesta.status(200).json(
    crearRespuesta(true, "El servicio está disponible.", { estado: "disponible" })
  );
});
rutas.post("/login", validarDto(InicioSesionDto), autenticacion.iniciarSesion);
rutas.post("/usuarios/registrar", validarDto(RegistrarUsuarioDto),usuarios.registrar);
rutas.get("/cartelera", requerirToken, cartelera.listar);
rutas.get("/asientos/disponibles", asientos.listarDisponibles);
rutas.post("/reserva", requerirToken, validarDto(CrearReservaDto), reservas.crear);

export default rutas;
