import type { ErrorRequestHandler, RequestHandler } from "express";
import { ErrorAplicacion } from "../comun/error-aplicacion";
import { crearRespuesta } from "../comun/respuesta-http";

export const rutaNoEncontrada: RequestHandler = (_solicitud, respuesta) => {
  respuesta.status(404).json(
    crearRespuesta(false, "La ruta solicitada no existe. Verifica la dirección y el método HTTP.", null)
  );
};

export const manejarErrores: ErrorRequestHandler = (error: unknown, _solicitud, respuesta, _siguiente) => {
  if (error instanceof ErrorAplicacion) {
    return respuesta.status(error.codigoHttp).json(
      crearRespuesta(false, error.message, null)
    );
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "type" in error
  ) {
    if (error.type === "entity.parse.failed") {
      return respuesta.status(400).json(
        crearRespuesta(false, "El cuerpo de la solicitud contiene JSON mal formado.", null)
      );
    }
    if (error.type === "entity.too.large") {
      return respuesta.status(413).json(
        crearRespuesta(false, "El cuerpo de la solicitud supera el tamaño máximo permitido.", null)
      );
    }
  }

  console.error("Ocurrió un error inesperado al procesar la solicitud.", error);
  return respuesta.status(500).json(
    crearRespuesta(false, "Ocurrió un error interno. Intenta nuevamente más tarde.", null)
  );
};
