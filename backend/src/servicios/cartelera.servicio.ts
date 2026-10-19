import { baseDatos } from "../configuracion/base-datos";
import { Pelicula } from "../entidades/pelicula";

export class CarteleraServicio {
  async listar(): Promise<Array<{ id: number; titulo: string }>> {
    const peliculas = await baseDatos.getRepository(Pelicula).find({
      select: { id: true, titulo: true },
      order: { titulo: "ASC" }
    });
    return peliculas.map((pelicula) => ({
      id: pelicula.id,
      titulo: pelicula.titulo
    }));
  }
}
