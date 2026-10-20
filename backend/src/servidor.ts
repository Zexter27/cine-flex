import { app } from "./app";
import { configuracion } from "./configuracion/entorno";

export async function iniciarServidor(): Promise<void> {
  app.listen(configuracion.puerto, () => {
    console.log(`CineFlex mock está disponible en el puerto ${configuracion.puerto}.`);
  });
}

if (require.main === module) {
  iniciarServidor().catch((error: unknown) => {
    console.error("No fue posible iniciar CineFlex en modo mock.", error);
    process.exitCode = 1;
  });
}
