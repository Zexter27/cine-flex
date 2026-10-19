import "reflect-metadata";
import { DataSource } from "typeorm";
import { configuracion } from "./entorno";
import { Asiento } from "../entidades/asiento";
import { Funcion } from "../entidades/funcion";
import { Pelicula } from "../entidades/pelicula";
import { Reserva } from "../entidades/reserva";
import { Sala } from "../entidades/sala";
import { Usuario } from "../entidades/usuario";

export const baseDatos = new DataSource({
  type: "mysql",
  host: configuracion.baseDatos.anfitrion,
  port: configuracion.baseDatos.puerto,
  username: configuracion.baseDatos.usuario,
  password: configuracion.baseDatos.contrasena,
  database: configuracion.baseDatos.nombre,
  synchronize: configuracion.baseDatos.sincronizar,
  logging: configuracion.baseDatos.registrarConsultas,
  entities: [Usuario, Pelicula, Sala, Asiento, Funcion, Reserva]
});

export async function inicializarBaseDatos(): Promise<void> {
  if (!baseDatos.isInitialized) {
    await baseDatos.initialize();
  }
}
