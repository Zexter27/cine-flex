import { plainToInstance } from "class-transformer";
import { validate, type ValidationError } from "class-validator";
import type { NextFunction, Request, Response } from "express";
import { crearRespuesta } from "../comun/respuesta-http";

type ConstructorDto<T extends object> = new () => T;

function obtenerDetallesValidacion(errores: ValidationError[]): string[] {
  return errores.flatMap((error) => [
    ...Object.values(error.constraints ?? {}),
    ...obtenerDetallesValidacion(error.children ?? [])
  ]);
}

export function validarDto<T extends object>(tipoDto: ConstructorDto<T>) {
  return async (solicitud: Request, respuesta: Response, siguiente: NextFunction) => {
    const dto = plainToInstance(tipoDto, solicitud.body);
    const errores = await validate(dto, { whitelist: true, forbidNonWhitelisted: true });

    if (errores.length > 0) {
      return respuesta.status(400).json(
        crearRespuesta(
          false,
          "La información enviada no es válida. Revisa los campos indicados.",
          obtenerDetallesValidacion(errores)
        )
      );
    }

    solicitud.body = dto;
    return siguiente();
  };
}
