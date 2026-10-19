import type { Request, Response, NextFunction } from "express";
import { crearRespuesta } from "../comun/respuesta-http";
import { RegistrarUsuarioDto } from "../dto/registrar-usuario.dto";
import { UsuarioServicio } from "../servicios/usuario.servicio";

export class UsuarioControlador {
  constructor(private readonly servicio: UsuarioServicio) {}

  registrar = async (
    solicitud: Request<unknown, unknown, RegistrarUsuarioDto>,
    respuesta: Response,
    siguiente: NextFunction
  ) => {
    try {
      const usuario = await this.servicio.registrar(solicitud.body);
      return respuesta.status(201).json(
        crearRespuesta(
          true,
          "El usuario se registró efectivamente en el sistema.",
          usuario
        )
      );
    } catch (error) {
      return siguiente(error);
    }
  };
}
