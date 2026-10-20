import { ErrorAplicacion } from "../comun/error-aplicacion";
import { InicioSesionDto } from "../dto/inicio-sesion.dto";
import { CREDENCIALES_MOCK, mockStore } from "../mocks/mock-datos";
import { crearToken } from "./autenticacion.servicio";

const intentosFallidos = new Map<string, { contador: number; bloqueadoHasta: number }>();

function obtenerBloqueoActual(correo: string): { contador: number; bloqueadoHasta: number } {
  const bloqueo = intentosFallidos.get(correo);
  if (!bloqueo) {
    return { contador: 0, bloqueadoHasta: 0 };
  }

  if (bloqueo.bloqueadoHasta === 0 || bloqueo.bloqueadoHasta > Date.now()) {
    return bloqueo;
  }

  intentosFallidos.delete(correo);
  return { contador: 0, bloqueadoHasta: 0 };
}

export class InicioSesionServicio {
  async iniciar(datos: InicioSesionDto): Promise<{
    usuario: { id: number; correoElectronico: string };
    token: string;
  }> {
    const correoNormalizado = datos.correoElectronico.trim().toLowerCase();
    const contrasenaNormalizada = datos.contrasena.trim();
    const bloqueo = obtenerBloqueoActual(correoNormalizado);

    if (bloqueo.bloqueadoHasta > Date.now()) {
      throw new ErrorAplicacion(
        "La cuenta está bloqueada temporalmente por demasiados intentos fallidos. Inténtalo más tarde.",
        423
      );
    }

    const usuario = mockStore.usuarios.find(
      (item) => item.correoElectronico.toLowerCase() === correoNormalizado
    );

    const credencialesValidas =
      correoNormalizado === CREDENCIALES_MOCK.usuario.toLowerCase() &&
      contrasenaNormalizada === CREDENCIALES_MOCK.contrasena;

    const usuarioActivo = usuario ?? mockStore.usuarios[0];
    const credencialesIncorrectas = Boolean(usuarioActivo) && usuarioActivo.contrasena !== contrasenaNormalizada;

    if ((!usuario && !credencialesValidas) || (usuarioActivo && !credencialesValidas && credencialesIncorrectas)) {
      const siguienteIntento = obtenerBloqueoActual(correoNormalizado);
      const contador = siguienteIntento.contador + 1;
      const bloqueoTemporalMs = contador >= 3 ? 5 * 60 * 1000 : 30 * 1000;
      intentosFallidos.set(correoNormalizado, {
        contador,
        bloqueadoHasta: contador >= 3 ? Date.now() + bloqueoTemporalMs : 0
      });

      if (contador >= 3) {
        throw new ErrorAplicacion(
          "Se superó el límite de intentos. La cuenta quedó bloqueada temporalmente durante 5 minutos.",
          423
        );
      }

      throw new ErrorAplicacion(
        "El correo electrónico o la contraseña no son correctos.",
        401
      );
    }

    intentosFallidos.delete(correoNormalizado);

    return {
      usuario: {
        id: usuarioActivo.id,
        correoElectronico: usuarioActivo.correoElectronico
      },
      token: crearToken(String(usuarioActivo.id))
    };
  }
}
