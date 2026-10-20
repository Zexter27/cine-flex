import { ErrorAplicacion } from "../comun/error-aplicacion";
import { CrearReservaDto } from "../dto/crear-reserva.dto";
import { PasarelaPagosMock, type TipoTarjeta } from "../mocks/pasarela-pagos.mock";

export interface ResultadoReserva {
  idTransaccion: string;
  codigo: string;
  estado: "aprobado" | "rechazado";
  monto: number;
  moneda: string;
  mensaje: string;
}

export class ReservaServicio {
  procesar(datos: CrearReservaDto): ResultadoReserva {
    const pasarela = new PasarelaPagosMock();
    const pago = pasarela.procesarPago({
      numeroTarjeta: datos.numeroTarjeta,
      nombreTitular: datos.nombreTitular,
      mesExpiracion: datos.mesExpiracion,
      anioExpiracion: datos.anioExpiracion,
      cvv: datos.cvv,
      monto: datos.monto,
      moneda: datos.moneda,
      tipoTarjeta: datos.tipoTarjeta as TipoTarjeta,
      correoElectronico: datos.correoElectronico
    });

    if (!pago.aprobado) {
      throw new ErrorAplicacion(pago.mensaje, pago.codigoHttp);
    }

    return {
      idTransaccion: pago.idTransaccion,
      codigo: pago.codigo,
      estado: "aprobado",
      monto: pago.monto,
      moneda: pago.moneda,
      mensaje: pago.mensaje
    };
  }
}
