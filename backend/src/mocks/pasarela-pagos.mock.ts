export type TipoTarjeta = "visa" | "mastercard" | "amex" | "diners";

export interface PagoMockRequest {
  numeroTarjeta: string;
  nombreTitular: string;
  mesExpiracion: string;
  anioExpiracion: string;
  cvv: string;
  monto: number;
  moneda?: string;
  tipoTarjeta?: TipoTarjeta;
  correoElectronico?: string;
}

export interface RespuestaPagoMock {
  aprobado: boolean;
  codigoHttp: number;
  codigo: string;
  mensaje: string;
  idTransaccion: string;
  monto: number;
  moneda: string;
  tipoTarjeta: TipoTarjeta;
}

const TARJETAS_PERMITIDAS: Record<TipoTarjeta, { patron: RegExp; longitud: number[] }> = {
  visa: { patron: /^4\d{12}(\d{3})?$/, longitud: [13, 16, 19] },
  mastercard: { patron: /^5[1-5]\d{14}$/, longitud: [16] },
  amex: { patron: /^3[47]\d{13}$/, longitud: [15] },
  diners: { patron: /^3(?:0[0-5]|[68]\d)\d{11}$/, longitud: [14, 16] }
};

function normalizarNumeroTarjeta(valor: string): string {
  return valor.replace(/\s+/g, "").replace(/-/g, "");
}

function obtenerTipoTarjeta(numero: string): TipoTarjeta | null {
  const tarjeta = (Object.entries(TARJETAS_PERMITIDAS) as Array<[TipoTarjeta, { patron: RegExp; longitud: number[] }]>).find(
    ([, detalle]) => detalle.patron.test(numero)
  );

  return tarjeta ? tarjeta[0] : null;
}

export class PasarelaPagosMock {
  procesarPago(datos: PagoMockRequest): RespuestaPagoMock {
    const numero = normalizarNumeroTarjeta(datos.numeroTarjeta ?? "");
    const tipoTarjeta = datos.tipoTarjeta ?? obtenerTipoTarjeta(numero);

    if (!numero || !/^\d+$/.test(numero)) {
      return {
        aprobado: false,
        codigoHttp: 400,
        codigo: "invalid_card_number",
        mensaje: "El número de tarjeta es obligatorio y debe contener únicamente dígitos.",
        idTransaccion: "",
        monto: datos.monto,
        moneda: datos.moneda ?? "COP",
        tipoTarjeta: tipoTarjeta ?? "visa"
      };
    }

    if (!tipoTarjeta) {
      return {
        aprobado: false,
        codigoHttp: 422,
        codigo: "unsupported_card",
        mensaje: "La tarjeta no es compatible con la pasarela de pruebas.",
        idTransaccion: "",
        monto: datos.monto,
        moneda: datos.moneda ?? "COP",
        tipoTarjeta: "visa"
      };
    }

    const longitudValida = TARJETAS_PERMITIDAS[tipoTarjeta].longitud.includes(numero.length);
    if (!longitudValida) {
      return {
        aprobado: false,
        codigoHttp: 422,
        codigo: "invalid_card_length",
        mensaje: "La longitud de la tarjeta no coincide con el tipo de tarjeta permitido.",
        idTransaccion: "",
        monto: datos.monto,
        moneda: datos.moneda ?? "COP",
        tipoTarjeta
      };
    }

    const nombreTitular = (datos.nombreTitular ?? "").trim();
    if (!nombreTitular || nombreTitular.length < 3) {
      return {
        aprobado: false,
        codigoHttp: 400,
        codigo: "invalid_cardholder",
        mensaje: "El nombre del titular es obligatorio.",
        idTransaccion: "",
        monto: datos.monto,
        moneda: datos.moneda ?? "COP",
        tipoTarjeta
      };
    }

    const mes = Number.parseInt(datos.mesExpiracion ?? "0", 10);
    const anio = Number.parseInt(datos.anioExpiracion ?? "0", 10);
    const anioCompleto = anio < 100 ? 2000 + anio : anio;
    const hoy = new Date();
    const fechaExpiracion = new Date(anioCompleto, mes, 0, 23, 59, 59, 999);

    if (!Number.isFinite(mes) || mes < 1 || mes > 12 || !Number.isFinite(anio) || fechaExpiracion < hoy) {
      return {
        aprobado: false,
        codigoHttp: 402,
        codigo: "expired_card",
        mensaje: "La tarjeta está vencida o la fecha de expiración no es válida.",
        idTransaccion: "",
        monto: datos.monto,
        moneda: datos.moneda ?? "COP",
        tipoTarjeta
      };
    }

    const cvv = String(datos.cvv ?? "").trim();
    const longitudCvvEsperada = tipoTarjeta === "amex" ? 4 : 3;
    if (!/^\d+$/.test(cvv) || cvv.length !== longitudCvvEsperada) {
      return {
        aprobado: false,
        codigoHttp: 402,
        codigo: "invalid_cvv",
        mensaje: `El CVV es inválido. Debe contener ${longitudCvvEsperada} dígitos para ${tipoTarjeta}.`,
        idTransaccion: "",
        monto: datos.monto,
        moneda: datos.moneda ?? "COP",
        tipoTarjeta
      };
    }

    if (datos.monto <= 0) {
      return {
        aprobado: false,
        codigoHttp: 400,
        codigo: "invalid_amount",
        mensaje: "El monto de la transacción debe ser mayor a cero.",
        idTransaccion: "",
        monto: datos.monto,
        moneda: datos.moneda ?? "COP",
        tipoTarjeta
      };
    }

    if (datos.monto > 2500000) {
      return {
        aprobado: false,
        codigoHttp: 402,
        codigo: "insufficient_funds",
        mensaje: "La tarjeta no tiene fondos suficientes para cubrir la transacción.",
        idTransaccion: "",
        monto: datos.monto,
        moneda: datos.moneda ?? "COP",
        tipoTarjeta
      };
    }

    if (datos.correoElectronico && datos.correoElectronico.toLowerCase() !== "edwin@gmail.com") {
      return {
        aprobado: false,
        codigoHttp: 403,
        codigo: "fraud_detected",
        mensaje: "La transacción fue marcada como sospechosa por fraude.",
        idTransaccion: "",
        monto: datos.monto,
        moneda: datos.moneda ?? "COP",
        tipoTarjeta
      };
    }

    return {
      aprobado: true,
      codigoHttp: 200,
      codigo: "approved",
      mensaje: "La transacción fue aprobada correctamente.",
      idTransaccion: `CF-${Date.now()}`,
      monto: datos.monto,
      moneda: datos.moneda ?? "COP",
      tipoTarjeta
    };
  }
}
