import path from "node:path";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });
dotenv.config({ path: path.resolve(process.cwd(), "..", ".env") });

function obtenerTexto(nombre: string): string {
  const valor = process.env[nombre];
  if (valor === undefined || valor.trim() === "") {
    throw new Error(`La variable de entorno ${nombre} es obligatoria.`);
  }
  return valor.trim();
}

function obtenerTextoOpcional(nombre: string): string {
  return process.env[nombre]?.trim() ?? "";
}

function obtenerEntero(nombre: string): number {
  const valor = obtenerTexto(nombre);
  const numero = Number(valor);
  if (!Number.isInteger(numero)) {
    throw new Error(`La variable de entorno ${nombre} debe ser un número entero.`);
  }
  return numero;
}

function obtenerBandera(nombre: string): boolean {
  const valor = obtenerTexto(nombre).toLowerCase();
  if (valor !== "true" && valor !== "false") {
    throw new Error(`La variable de entorno ${nombre} debe ser true o false.`);
  }
  return valor === "true";
}

const puerto = obtenerEntero("PORT");
if (puerto < 1 || puerto > 65535) {
  throw new Error("La variable de entorno PORT debe estar entre 1 y 65535.");
}

const secretoJwt = obtenerTexto("JWT_SECRET");
if (secretoJwt.length < 32) {
  throw new Error("La variable JWT_SECRET debe tener al menos 32 caracteres.");
}

const duracionTokenSegundos = obtenerEntero("JWT_DURACION_SEGUNDOS");
if (duracionTokenSegundos < 1) {
  throw new Error("La variable JWT_DURACION_SEGUNDOS debe ser mayor que cero.");
}

const limiteCuerpoBytes = obtenerEntero("LIMITE_CUERPO_BYTES");
if (limiteCuerpoBytes < 1) {
  throw new Error("La variable LIMITE_CUERPO_BYTES debe ser mayor que cero.");
}

const rutaBackend = path.resolve(__dirname, "../..");

export const configuracion = Object.freeze({
  puerto,
  jwt: Object.freeze({
    secreto: secretoJwt,
    duracionSegundos: duracionTokenSegundos
  }),
  limiteCuerpoBytes,
  formatoRegistro: obtenerTexto("MORGAN_FORMAT"),
  rutaInterfaz: path.resolve(rutaBackend, obtenerTexto("FRONTEND_PATH"))
});
