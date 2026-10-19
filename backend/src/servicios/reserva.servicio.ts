import { ErrorAplicacion } from "../comun/error-aplicacion";

export class ReservaServicio {
  procesar(numeroTarjeta: string): never {
    if (!numeroTarjeta) {
      throw new ErrorAplicacion("Se requiere una tarjeta de prueba.", 400);
    }
    throw new ErrorAplicacion(
      "El pago no pudo procesarse porque la tarjeta de prueba fue rechazada.",
      402
    );
  }
}
