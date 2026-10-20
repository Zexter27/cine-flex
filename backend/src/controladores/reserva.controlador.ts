import type { Request, Response, NextFunction } from "express";
import { crearRespuesta } from "../comun/respuesta-http";
import { CrearReservaDto } from "../dto/crear-reserva.dto";
import { ReservaServicio } from "../servicios/reserva.servicio";

export class ReservaControlador {
  constructor(private readonly servicio: ReservaServicio) {}

  crear = async (
    solicitud: Request<unknown, unknown, CrearReservaDto>,
    respuesta: Response,
    siguiente: NextFunction
  ) => {
    try {
      const resultado = this.servicio.procesar(solicitud.body);
      return respuesta.status(200).json(
        crearRespuesta(true, "La reserva se registró correctamente.", resultado)
      );
    } catch (error) {
      return siguiente(error);
    }
  };
}
