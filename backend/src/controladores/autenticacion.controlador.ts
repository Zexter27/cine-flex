import type { NextFunction, Request, Response } from "express";
import { crearRespuesta } from "../comun/respuesta-http";
import { InicioSesionDto } from "../dto/inicio-sesion.dto";
import { InicioSesionServicio } from "../servicios/inicio-sesion.servicio";

export class AutenticacionControlador {
  constructor(private readonly servicio: InicioSesionServicio) {}

  iniciarSesion = async (
    solicitud: Request<unknown, unknown, InicioSesionDto>,
    respuesta: Response,
    siguiente: NextFunction
  ) => {
    try {
      const resultado = await this.servicio.iniciar(solicitud.body);
      return respuesta.status(200).json(
        crearRespuesta(true, "El inicio de sesión se realizó efectivamente.", resultado)
      );
    } catch (error) {
      return siguiente(error);
    }
  };
}
