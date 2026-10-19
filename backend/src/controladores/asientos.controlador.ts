import type { Request, Response, NextFunction } from "express";
import { crearRespuesta } from "../comun/respuesta-http";
import { AsientosServicio } from "../servicios/asientos.servicio";

export class AsientosControlador {
  constructor(private readonly servicio: AsientosServicio) {}

  listarDisponibles = async (
    _solicitud: Request,
    respuesta: Response,
    siguiente: NextFunction
  ) => {
    try {
      const asientos = await this.servicio.listarDisponibles();
      return respuesta.status(200).json(
        crearRespuesta(true, "Los asientos disponibles se consultaron correctamente.", asientos)
      );
    } catch (error) {
      return siguiente(error);
    }
  };
}
