export class ErrorAplicacion extends Error {
  constructor(
    mensaje: string,
    public readonly codigoHttp: number
  ) {
    super(mensaje);
    this.name = "ErrorAplicacion";
  }
}
