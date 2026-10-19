import { createHmac, timingSafeEqual } from "node:crypto";
import { configuracion } from "../configuracion/entorno";

function codificarBase64Url(valor: string): string {
  return Buffer.from(valor).toString("base64url");
}

export function crearToken(usuario: string): string {
  const encabezado = codificarBase64Url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const contenido = codificarBase64Url(JSON.stringify({
    sub: usuario,
    exp: Math.floor(Date.now() / 1000) + configuracion.jwt.duracionSegundos
  }));
  const firmaContenido = `${encabezado}.${contenido}`;
  const firma = createHmac("sha256", configuracion.jwt.secreto)
    .update(firmaContenido)
    .digest("base64url");
  return `${firmaContenido}.${firma}`;
}

export function tokenValido(token: string): boolean {
  const partes = token.split(".");
  if (partes.length !== 3) {
    return false;
  }

  const contenidoFirmado = `${partes[0]}.${partes[1]}`;
  const firmaEsperada = createHmac("sha256", configuracion.jwt.secreto)
    .update(contenidoFirmado)
    .digest();
  const firmaRecibida = Buffer.from(partes[2], "base64url");
  if (
    firmaRecibida.length !== firmaEsperada.length ||
    !timingSafeEqual(firmaRecibida, firmaEsperada)
  ) {
    return false;
  }

  try {
    const datos = JSON.parse(Buffer.from(partes[1], "base64url").toString("utf8")) as {
      sub?: unknown;
      exp?: unknown;
    };
    return typeof datos.sub === "string" &&
      typeof datos.exp === "number" &&
      datos.exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}
