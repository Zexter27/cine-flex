import bcrypt from "bcryptjs";
import { ErrorAplicacion } from "../comun/error-aplicacion";
import { RegistrarUsuarioDto } from "../dto/registrar-usuario.dto";
import { mockStore } from "../mocks/mock-datos";

export interface UsuarioRegistrado {
  id: number;
  nombres: string;
  apellidos: string;
  correoElectronico: string;
  fechaCreacion: Date;
}

export class UsuarioServicio {
  async registrar(datos: RegistrarUsuarioDto): Promise<UsuarioRegistrado> {
    const correoNormalizado = datos.correoElectronico.trim().toLowerCase();
    const usuarioExistente = mockStore.usuarios.find(
      (usuario) => usuario.correoElectronico.toLowerCase() === correoNormalizado
    );

    if (usuarioExistente) {
      throw new ErrorAplicacion(
        "Ya existe una cuenta registrada con ese correo electrónico.",
        409
      );
    }

    const nuevoUsuario = {
      id: mockStore.usuarios.length + 1001,
      nombres: datos.nombres,
      apellidos: datos.apellidos,
      correoElectronico: correoNormalizado,
      contrasena: await bcrypt.hash(datos.contrasena, await bcrypt.genSalt())
    };

    mockStore.usuarios.push(nuevoUsuario);

    return {
      id: nuevoUsuario.id,
      nombres: nuevoUsuario.nombres,
      apellidos: nuevoUsuario.apellidos,
      correoElectronico: nuevoUsuario.correoElectronico,
      fechaCreacion: new Date()
    };
  }
}
