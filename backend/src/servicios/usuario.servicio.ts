import bcrypt from "bcryptjs";
import { QueryFailedError } from "typeorm";
import { ErrorAplicacion } from "../comun/error-aplicacion";
import { baseDatos } from "../configuracion/base-datos";
import { Usuario } from "../entidades/usuario";
import { RegistrarUsuarioDto } from "../dto/registrar-usuario.dto";

export interface UsuarioRegistrado {
  id: number;
  nombres: string;
  apellidos: string;
  correoElectronico: string;
  fechaCreacion: Date;
}

function esViolacionUnicidad(error: unknown): boolean {
  if (!(error instanceof QueryFailedError)) {
    return false;
  }

  const detalle = error.driverError as { code?: string };
  return detalle.code === "ER_DUP_ENTRY";
}

export class UsuarioServicio {
  async registrar(datos: RegistrarUsuarioDto): Promise<UsuarioRegistrado> {
    const repositorio = baseDatos.getRepository(Usuario);
    const usuarioExistente = await repositorio.findOneBy({
      correoElectronico: datos.correoElectronico
    });

    if (usuarioExistente) {
      throw new ErrorAplicacion(
        "Ya existe una cuenta registrada con ese correo electrónico.",
        409
      );
    }

    const usuario = repositorio.create({
      nombres: datos.nombres,
      apellidos: datos.apellidos,
      correoElectronico: datos.correoElectronico,
      contrasenaHash: await bcrypt.hash(datos.contrasena, await bcrypt.genSalt())
    });

    try {
      const usuarioGuardado = await repositorio.save(usuario);
      return {
        id: usuarioGuardado.id,
        nombres: usuarioGuardado.nombres,
        apellidos: usuarioGuardado.apellidos,
        correoElectronico: usuarioGuardado.correoElectronico,
        fechaCreacion: usuarioGuardado.fechaCreacion
      };
    } catch (error) {
      if (esViolacionUnicidad(error)) {
        throw new ErrorAplicacion(
          "Ya existe una cuenta registrada con ese correo electrónico.",
          409
        );
      }
      throw error;
    }
  }
}
