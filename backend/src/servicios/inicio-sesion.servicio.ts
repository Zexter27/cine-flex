import { ErrorAplicacion } from "../comun/error-aplicacion";
import { InicioSesionDto } from "../dto/inicio-sesion.dto";
import { CREDENCIALES_MOCK, mockStore } from "../mocks/mock-datos";
import { crearToken } from "./autenticacion.servicio";

export class InicioSesionServicio {
  async iniciar(datos: InicioSesionDto): Promise<{
    usuario: { id: number; correoElectronico: string };
    token: string;
  }> {
    const correoNormalizado = datos.correoElectronico.trim().toLowerCase();
    const contrasenaNormalizada = datos.contrasena.trim();

    const usuario = mockStore.usuarios.find(
      (item) => item.correoElectronico.toLowerCase() === correoNormalizado
    );

    const credencialesValidas =
      correoNormalizado === CREDENCIALES_MOCK.usuario.toLowerCase() &&
      contrasenaNormalizada === CREDENCIALES_MOCK.contrasena;

    if (!usuario && !credencialesValidas) {
      throw new ErrorAplicacion(
        "El correo electrónico o la contraseña no son correctos.",
        401
      );
    }

    const usuarioActivo = usuario ?? mockStore.usuarios[0];

    if (usuarioActivo && usuarioActivo.contrasena !== contrasenaNormalizada && !credencialesValidas) {
      throw new ErrorAplicacion(
        "El correo electrónico o la contraseña no son correctos.",
        401
      );
    }

    return {
      usuario: {
        id: usuarioActivo.id,
        correoElectronico: usuarioActivo.correoElectronico
      },
      token: crearToken(String(usuarioActivo.id))
    };
  }
}
