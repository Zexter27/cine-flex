import { app } from "./app";
import { configuracion } from "./configuracion/entorno";
import { inicializarBaseDatos } from "./configuracion/base-datos";

export async function iniciarServidor(): Promise<void> {
  await inicializarBaseDatos();
  app.listen(configuracion.puerto, () => {
    console.log(`CineFlex está disponible en el puerto ${configuracion.puerto}.`);
  });
}

if (require.main === module) {
  iniciarServidor().catch((error: unknown) => {
    console.error("No fue posible iniciar CineFlex o conectar con la base de datos.", error);
    process.exitCode = 1;
  });
}
