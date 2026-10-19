export interface RespuestaHttp<T> {
  exito: boolean;
  mensaje: string;
  datos: T | null;
}

export function crearRespuesta<T>(
  exito: boolean,
  mensaje: string,
  datos: T | null
): RespuestaHttp<T> {
  return { exito, mensaje, datos };
}
