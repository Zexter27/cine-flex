import { randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";
import { ErrorAplicacion } from "../comun/error-aplicacion";
import { baseDatos } from "../configuracion/base-datos";
import { InicioSesionDto } from "../dto/inicio-sesion.dto";
import { Usuario } from "../entidades/usuario";
import { crearToken } from "./autenticacion.servicio";

export class InicioSesionServicio {
  private readonly hashComparacionInexistente = this.crearHashComparacionInexistente();

  private async crearHashComparacionInexistente(): Promise<string> {
    const contrasenaAleatoria = randomBytes(32).toString("hex");
    const sal = await bcrypt.genSalt();
    return bcrypt.hash(contrasenaAleatoria, sal);
  }

  async iniciar(datos: InicioSesionDto): Promise<{
    usuario: { id: number; correoElectronico: string };
    token: string;
  }> {
    const usuario = await baseDatos
      .getRepository(Usuario)
      .createQueryBuilder("usuario")
      .addSelect("usuario.contrasenaHash")
      .where("usuario.correoElectronico = :correoElectronico", {
        correoElectronico: datos.correoElectronico
      })
      .getOne();

    const hashAlmacenado = usuario?.contrasenaHash ??
      await this.hashComparacionInexistente;
    const contrasenaValida = await bcrypt.compare(datos.contrasena, hashAlmacenado);

    if (!usuario || !contrasenaValida) {
      throw new ErrorAplicacion(
        "El correo electrónico o la contraseña no son correctos.",
        401
      );
    }

    return {
      usuario: {
        id: usuario.id,
        correoElectronico: usuario.correoElectronico
      },
      token: crearToken(String(usuario.id))
    };
  }
}
