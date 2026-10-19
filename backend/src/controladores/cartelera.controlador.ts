import type { Request, Response, NextFunction } from "express";
import { crearRespuesta } from "../comun/respuesta-http";
import { CarteleraServicio } from "../servicios/cartelera.servicio";

export class CarteleraControlador {
  constructor(private readonly servicio: CarteleraServicio) {}

  listar = async (_solicitud: Request, respuesta: Response, siguiente: NextFunction) => {
    try {
      const peliculas = await this.servicio.listar();
      return respuesta.status(200).json(
        crearRespuesta(true, "La cartelera se consultó correctamente.", peliculas)
      );
    } catch (error) {
      return siguiente(error);
    }
  };
}
