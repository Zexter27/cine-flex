import type { Request, Response, NextFunction } from "express";
import { CrearReservaDto } from "../dto/crear-reserva.dto";
import { ReservaServicio } from "../servicios/reserva.servicio";

export class ReservaControlador {
  constructor(private readonly servicio: ReservaServicio) {}

  crear = (
    solicitud: Request<unknown, unknown, CrearReservaDto>,
    _respuesta: Response,
    siguiente: NextFunction
  ) => {
    try {
      this.servicio.procesar(solicitud.body.numeroTarjeta);
    } catch (error) {
      return siguiente(error);
    }
  };
}
