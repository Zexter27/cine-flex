import type { NextFunction, Request, Response } from "express";
import { crearRespuesta } from "../comun/respuesta-http";
import { tokenValido } from "../servicios/autenticacion.servicio";

export function requerirToken(solicitud: Request, respuesta: Response, siguiente: NextFunction) {
  const autorizacion = solicitud.get("authorization") ?? "";
  const coincidencia = autorizacion.match(/^Bearer\s+(.+)$/i);

  if (!coincidencia || !tokenValido(coincidencia[1])) {
    return respuesta.status(401).json(
      crearRespuesta(false, "Debes iniciar sesión con un token válido para acceder a este recurso.", null)
    );
  }
  return siguiente();
}
